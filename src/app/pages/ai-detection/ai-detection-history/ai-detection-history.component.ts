import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AiDetectionHistoryItem } from '../../../core/models/ai-detection.model';
import { AiDetectionService } from '../../../core/services/ai-detection.service';
import { ToastService } from '../../../core/services/toast.service';
import { ClassificationBadgeComponent } from '../../../shared/components/classification-badge/classification-badge.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ProbabilityBarComponent } from '../../../shared/components/probability-bar/probability-bar.component';

@Component({
  selector: 'app-ai-detection-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    ConfirmationDialogComponent,
    ClassificationBadgeComponent,
    ProbabilityBarComponent
  ],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-text-primary">Historial de Detección IA</h1>
          <p class="text-text-muted mt-1">Revisa y gestiona tus análisis anteriores</p>
        </div>
        <div class="flex gap-3">
          <button 
            (click)="navigateToDetection()"
            type="button"
            title="Ir a la página de detección de IA"
            class="px-4 py-2 bg-php-purple text-white rounded-lg hover:bg-php-dark-purple transition-colors hover-lift flex items-center gap-2">
            <i class="gg-add" aria-hidden="true"></i>
            Nueva Detección
          </button>
          <button 
            *ngIf="history.length > 0"
            (click)="openDeleteAllDialog()"
            type="button"
            title="Eliminar todo el historial de análisis"
            class="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30 flex items-center gap-2">
            <i class="gg-trash" aria-hidden="true"></i>
            Eliminar Todo
          </button>
        </div>
      </div>

      <!-- Stats Card -->
      <div class="bg-bg-secondary rounded-xl p-6 border border-php-purple/20 glass-effect">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-text-muted text-sm">Total de Consultas</p>
            <p class="text-3xl font-bold text-text-primary mt-1">{{ totalCount }}</p>
          </div>
          <div class="w-16 h-16 bg-php-purple/20 rounded-lg flex items-center justify-center">
            <i class="gg-list text-php-purple text-2xl"></i>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-bg-secondary rounded-xl p-4 border border-php-purple/20 glass-effect">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex items-center gap-2">
            <label class="text-text-secondary text-sm">Idioma:</label>
            <select 
              [(ngModel)]="selectedLang" 
              (change)="filterByLanguage()"
              class="bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-php-purple">
              <option value="all">Todos</option>
              <option value="en">Inglés</option>
              <option value="es">Español</option>
            </select>
          </div>
          
          <div class="text-text-muted text-sm">
            Mostrando {{ filteredHistory.length }} de {{ history.length }} resultados
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <app-error-message 
        [error]="error" 
        [retryable]="true"
        (retry)="loadHistory()">
      </app-error-message>

      <!-- Loading Spinner -->
      <app-loading-spinner 
        *ngIf="isLoading" 
        [message]="'Cargando historial...'"
        [overlay]="false">
      </app-loading-spinner>

      <!-- History List -->
      <div *ngIf="!isLoading && filteredHistory.length > 0" class="space-y-4">
        <div 
          *ngFor="let item of paginatedHistory; let i = index" 
          class="bg-bg-secondary rounded-xl p-6 border border-php-purple/20 glass-effect hover:border-php-purple/40 transition-all animate-slide-up"
          [style.animation-delay]="i * 0.05 + 's'">
          
          <div class="flex items-start justify-between gap-4">
            <!-- Content -->
            <div class="flex-1 space-y-3">
              <!-- Text Preview -->
              <div>
                <p class="text-text-primary text-sm line-clamp-2">{{ item.text }}</p>
              </div>

              <!-- Metadata -->
              <div class="flex flex-wrap items-center gap-4 text-sm">
                <div class="flex items-center gap-2">
                  <span class="text-text-muted">ID:</span>
                  <span class="text-text-primary font-mono">{{ item.id }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-text-muted">Idioma:</span>
                  <span class="px-2 py-1 bg-php-purple/20 text-php-purple rounded-full text-xs">
                    {{ item.lang.toUpperCase() }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-text-muted">Fecha:</span>
                  <span class="text-text-primary">{{ formatDate(item.createdAt) }}</span>
                </div>
              </div>

              <!-- Classification and Probability -->
              <div class="flex flex-wrap items-center gap-4">
                <app-classification-badge [classification]="item.classification"></app-classification-badge>
                <div class="flex items-center gap-2">
                  <div class="w-24 bg-bg-tertiary rounded-full h-2">
                    <div 
                      class="h-2 rounded-full transition-all"
                      [style.width.%]="item.aiProbability * 100"
                      [ngClass]="getProbabilityColorClass(item.aiProbability)">
                    </div>
                  </div>
                  <span class="text-text-primary text-sm font-medium">
                    {{ (item.aiProbability * 100).toFixed(1) }}%
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-2">
              <button 
                (click)="viewDetails(item)"
                type="button"
                title="Ver detalles de la consulta"
                class="p-2 text-text-muted hover:text-php-purple transition-colors rounded-lg hover:bg-php-purple/10"
                aria-label="Ver detalles de la consulta">
                <i class="gg-eye" aria-hidden="true"></i>
              </button>
              <button 
                (click)="deleteItem(item.id)"
                type="button"
                title="Eliminar consulta"
                class="p-2 text-text-muted hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                aria-label="Eliminar consulta">
                <i class="gg-trash" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && filteredHistory.length === 0" class="bg-bg-secondary rounded-xl p-12 border border-php-purple/20 glass-effect text-center">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-semibold text-text-primary mb-2">No hay consultas en el historial</h3>
        <p class="text-text-muted mb-6">Comienza analizando tu primer texto</p>
        <button 
          (click)="navigateToDetection()"
          class="px-6 py-3 bg-php-purple text-white rounded-lg hover:bg-php-dark-purple transition-colors">
          Analizar Texto
        </button>
      </div>

      <!-- Pagination -->
      <div *ngIf="!isLoading && filteredHistory.length > itemsPerPage" class="bg-bg-secondary rounded-xl p-4 border border-php-purple/20 glass-effect">
        <div class="flex items-center justify-between">
          <div class="text-text-muted text-sm">
            Mostrando {{ getStartIndex() }} - {{ getEndIndex() }} de {{ filteredHistory.length }}
          </div>
          
          <div class="flex gap-2">
            <button 
              (click)="previousPage()"
              [disabled]="currentPage === 1"
              class="px-3 py-2 bg-bg-tertiary border border-php-purple/20 rounded-lg text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-php-purple/20 transition-colors">
              <i class="gg-chevron-left"></i>
            </button>
            
            <span class="px-4 py-2 bg-php-purple/20 text-php-purple rounded-lg text-sm font-medium">
              {{ currentPage }} / {{ totalPages }}
            </span>
            
            <button 
              (click)="nextPage()"
              [disabled]="currentPage === totalPages"
              class="px-3 py-2 bg-bg-tertiary border border-php-purple/20 rounded-lg text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-php-purple/20 transition-colors">
              <i class="gg-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div 
      *ngIf="selectedItem" 
      class="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      (keydown.escape)="closeDetails()">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" (click)="closeDetails()" aria-hidden="true"></div>
      
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-bg-secondary rounded-xl shadow-2xl border border-php-purple/20 w-full max-w-2xl transform transition-all animate-slide-up">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-php-purple/20">
            <h3 id="modal-title" class="text-lg font-semibold text-text-primary">Detalles de la Consulta</h3>
            <button 
              (click)="closeDetails()"
              type="button"
              aria-label="Cerrar modal"
              class="text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-bg-tertiary">
              <i class="gg-close text-lg" aria-hidden="true"></i>
            </button>
          </div>
          
          <!-- Content -->
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-text-secondary text-sm font-medium mb-2">Texto Analizado</label>
              <div class="bg-bg-tertiary rounded-lg p-4 text-text-primary text-sm max-h-48 overflow-y-auto border border-php-purple/10">
                {{ selectedItem.text }}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-text-secondary text-sm font-medium mb-2">ID</label>
                <p class="text-text-primary font-mono">{{ selectedItem.id }}</p>
              </div>
              <div>
                <label class="block text-text-secondary text-sm font-medium mb-2">Idioma</label>
                <span class="px-3 py-1 bg-php-purple/20 text-php-purple rounded-full text-sm">
                  {{ selectedItem.lang.toUpperCase() }}
                </span>
              </div>
            </div>

            <div>
              <label class="block text-text-secondary text-sm font-medium mb-2">Clasificación</label>
              <app-classification-badge [classification]="selectedItem.classification"></app-classification-badge>
            </div>

            <div>
              <label class="block text-text-secondary text-sm font-medium mb-2">Probabilidad de IA</label>
              <app-probability-bar [aiProbability]="selectedItem.aiProbability"></app-probability-bar>
            </div>

            <div>
              <label class="block text-text-secondary text-sm font-medium mb-2">Fecha de Creación</label>
              <p class="text-text-primary">{{ formatDate(selectedItem.createdAt) }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-3 p-6 border-t border-php-purple/20">
            <button 
              (click)="closeDetails()"
              type="button"
              class="px-4 py-2 bg-bg-tertiary text-text-primary rounded-lg hover:bg-bg-tertiary/80 transition-colors">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <app-confirmation-dialog
      [isOpen]="showDeleteDialog"
      [title]="deleteDialogTitle"
      [message]="deleteDialogMessage"
      [confirmText]="'Eliminar'"
      [cancelText]="'Cancelar'"
      (confirm)="confirmDelete()"
      (cancel)="cancelDelete()">
    </app-confirmation-dialog>
  `,
  styles: [`
    :host {
      display: block;
    }

    @keyframes fade-in {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slide-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }

    .animate-slide-up {
      animation: slide-up 0.4s ease-out;
    }

    .hover-lift {
      transition: transform 0.2s ease;
    }

    .hover-lift:hover {
      transform: translateY(-2px);
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class AiDetectionHistoryComponent implements OnInit {
  history: AiDetectionHistoryItem[] = [];
  filteredHistory: AiDetectionHistoryItem[] = [];
  selectedLang: string = 'all';
  totalCount: number = 0;
  isLoading: boolean = false;
  error: string | null = null;

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalPages: number = 0;

  // Modal
  selectedItem: AiDetectionHistoryItem | null = null;

  // Delete dialog
  showDeleteDialog: boolean = false;
  deleteDialogTitle: string = '';
  deleteDialogMessage: string = '';
  deleteAction: (() => void) | null = null;

  constructor(
    private aiDetectionService: AiDetectionService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadHistory();
    this.loadCount();
  }

  loadHistory(lang?: string): void {
    this.isLoading = true;
    this.error = null;

    console.log('🔍 Cargando historial de AI Detection...', lang ? `Idioma: ${lang}` : 'Todos los idiomas');

    this.aiDetectionService.getHistory(lang).subscribe({
      next: (data) => {
        console.log('✅ Historial recibido:', data);
        console.log('📊 Total de registros:', data?.length || 0);
        this.history = data;
        this.filteredHistory = data;
        this.calculatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar historial:', error);
        this.error = error.message || 'Error al cargar el historial';
        this.isLoading = false;
        this.toastService.showError('Error al cargar el historial');
      }
    });
  }

  loadCount(): void {
    console.log('🔢 Cargando contador de historial...');
    this.aiDetectionService.getHistoryCount().subscribe({
      next: (count) => {
        console.log('✅ Contador recibido:', count);
        this.totalCount = count;
      },
      error: (error) => {
        console.error('❌ Error loading count:', error);
      }
    });
  }

  filterByLanguage(): void {
    if (this.selectedLang === 'all') {
      this.loadHistory();
    } else {
      this.loadHistory(this.selectedLang);
    }
    this.currentPage = 1;
  }

  deleteItem(id: number): void {
    this.deleteDialogTitle = '¿Eliminar consulta?';
    this.deleteDialogMessage = '¿Estás seguro de que deseas eliminar esta consulta? Esta acción no se puede deshacer.';
    this.deleteAction = () => this.performDeleteItem(id);
    this.showDeleteDialog = true;
  }

  performDeleteItem(id: number): void {
    this.aiDetectionService.deleteHistoryItem(id).subscribe({
      next: () => {
        this.history = this.history.filter(item => item.id !== id);
        this.filteredHistory = this.filteredHistory.filter(item => item.id !== id);
        this.calculatePagination();
        this.loadCount();
        this.toastService.showSuccess('Consulta eliminada exitosamente');
      },
      error: (error) => {
        this.error = error.message || 'Error al eliminar la consulta';
        this.toastService.showError('Error al eliminar la consulta');
      }
    });
  }

  openDeleteAllDialog(): void {
    this.deleteDialogTitle = '¿Eliminar todo el historial?';
    this.deleteDialogMessage = '¿Estás seguro de que deseas eliminar todas las consultas? Esta acción no se puede deshacer.';
    this.deleteAction = () => this.performDeleteAll();
    this.showDeleteDialog = true;
  }

  performDeleteAll(): void {
    this.aiDetectionService.deleteAllHistory().subscribe({
      next: () => {
        this.history = [];
        this.filteredHistory = [];
        this.totalCount = 0;
        this.calculatePagination();
        this.toastService.showSuccess('Historial eliminado exitosamente');
      },
      error: (error) => {
        this.error = error.message || 'Error al eliminar el historial';
        this.toastService.showError('Error al eliminar el historial');
      }
    });
  }

  confirmDelete(): void {
    if (this.deleteAction) {
      this.deleteAction();
    }
    this.showDeleteDialog = false;
    this.deleteAction = null;
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.deleteAction = null;
  }

  viewDetails(item: AiDetectionHistoryItem): void {
    this.selectedItem = item;
  }

  closeDetails(): void {
    this.selectedItem = null;
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredHistory.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
  }

  get paginatedHistory(): AiDetectionHistoryItem[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredHistory.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredHistory.length);
  }

  getProbabilityColorClass(probability: number): string {
    if (probability >= 0.7) return 'bg-red-500';
    if (probability >= 0.4) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  navigateToDetection(): void {
    this.router.navigate(['/ai-detection']);
  }
}
