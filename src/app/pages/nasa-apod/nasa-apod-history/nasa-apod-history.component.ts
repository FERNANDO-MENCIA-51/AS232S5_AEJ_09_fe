import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NasaApodHistoryItem, NasaHistoryFilters } from '../../../core/models/nasa-apod.model';
import { NasaApodService } from '../../../core/services/nasa-apod.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-nasa-apod-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    ConfirmationDialogComponent
  ],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-text-primary">Historial NASA APOD</h1>
          <p class="text-text-muted mt-1">Revisa y gestiona tus imágenes astronómicas consultadas</p>
        </div>
        <div class="flex gap-3">
          <button 
            (click)="navigateToApod()"
            type="button"
            title="Ir a la página de búsqueda de imágenes NASA"
            class="px-4 py-2 bg-php-purple text-white rounded-lg hover:bg-php-dark-purple transition-colors hover-lift flex items-center gap-2">
            <i class="gg-add" aria-hidden="true"></i>
            Nueva Búsqueda
          </button>
          <button 
            *ngIf="history.length > 0"
            (click)="openDeleteAllDialog()"
            type="button"
            title="Eliminar todo el historial de imágenes"
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
            <p class="text-text-muted text-sm">Total de Imágenes Consultadas</p>
            <p class="text-3xl font-bold text-text-primary mt-1">{{ totalCount }}</p>
          </div>
          <div class="w-16 h-16 bg-php-purple/20 rounded-lg flex items-center justify-center">
            <i class="gg-image text-php-purple text-2xl"></i>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-bg-secondary rounded-xl p-4 border border-php-purple/20 glass-effect">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex items-center gap-2">
            <label class="text-text-secondary text-sm">Tipo de Media:</label>
            <select 
              [(ngModel)]="selectedMediaType" 
              (change)="filterByMediaType()"
              class="bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-php-purple">
              <option value="all">Todos</option>
              <option value="image">Imágenes</option>
              <option value="video">Videos</option>
            </select>
          </div>
          
          <div class="flex items-center gap-2 flex-1">
            <label class="text-text-secondary text-sm">Buscar:</label>
            <input 
              type="text"
              [(ngModel)]="searchTitle"
              (ngModelChange)="onSearchChange($event)"
              placeholder="Buscar por título..."
              class="flex-1 bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-php-purple">
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

      <!-- History Grid -->
      <div *ngIf="!isLoading && filteredHistory.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          *ngFor="let item of paginatedHistory; let i = index" 
          class="bg-bg-secondary rounded-xl border border-php-purple/20 glass-effect overflow-hidden hover:border-php-purple/40 transition-all hover-lift animate-slide-up"
          [style.animation-delay]="i * 0.05 + 's'">
          
          <!-- Image Preview -->
          <div class="relative h-48 bg-bg-tertiary">
            <img 
              *ngIf="item.mediaType === 'image' && item.imageUrl"
              [src]="item.imageUrl" 
              [alt]="item.title"
              class="w-full h-full object-cover"
              (error)="onImageError($event)">
            
            <div 
              *ngIf="item.mediaType === 'video' || !item.imageUrl"
              class="w-full h-full flex items-center justify-center">
              <i class="gg-play-button text-php-purple text-4xl"></i>
            </div>

            <!-- Status Badge -->
            <div class="absolute top-2 right-2">
              <span 
                class="px-2 py-1 rounded-full text-xs"
                [ngClass]="getStatusClass(item.status)">
                {{ item.status }}
              </span>
            </div>

            <!-- Media Type Badge -->
            <div class="absolute top-2 left-2">
              <span class="px-2 py-1 bg-black/50 text-white rounded-full text-xs backdrop-blur-sm">
                {{ item.mediaType === 'image' ? '📷' : '🎥' }} {{ item.mediaType }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4 space-y-3">
            <!-- Title -->
            <h3 class="text-text-primary font-semibold text-sm line-clamp-2">
              {{ item.title }}
            </h3>

            <!-- Explanation Preview -->
            <p class="text-text-muted text-xs line-clamp-2">
              {{ item.explanation }}
            </p>

            <!-- Metadata -->
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="text-text-muted">{{ formatDate(item.requestedDate) }}</span>
              </div>
              <span class="text-text-muted">ID: {{ item.id }}</span>
            </div>

            <!-- Copyright -->
            <div *ngIf="item.copyright" class="text-xs text-text-muted">
              © {{ item.copyright }}
            </div>

            <!-- Actions -->
            <div class="flex gap-2 pt-2 border-t border-php-purple/10">
              <button 
                (click)="viewDetails(item)"
                type="button"
                class="flex-1 px-3 py-2 bg-php-purple/20 text-php-purple rounded-lg hover:bg-php-purple/30 transition-colors text-xs font-medium">
                Ver Detalles
              </button>
              <button 
                (click)="deleteItem(item.id)"
                type="button"
                title="Eliminar imagen del historial"
                class="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-xs"
                aria-label="Eliminar imagen del historial">
                <i class="gg-trash" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && filteredHistory.length === 0" class="bg-bg-secondary rounded-xl p-12 border border-php-purple/20 glass-effect text-center">
        <div class="text-6xl mb-4">🌌</div>
        <h3 class="text-xl font-semibold text-text-primary mb-2">No hay imágenes en el historial</h3>
        <p class="text-text-muted mb-6">Comienza buscando tu primera imagen astronómica</p>
        <button 
          (click)="navigateToApod()"
          class="px-6 py-3 bg-php-purple text-white rounded-lg hover:bg-php-dark-purple transition-colors">
          Buscar Imagen
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
        <div class="relative bg-bg-secondary rounded-xl shadow-2xl border border-php-purple/20 w-full max-w-4xl transform transition-all animate-slide-up">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-php-purple/20">
            <h3 id="modal-title" class="text-lg font-semibold text-text-primary">{{ selectedItem.title }}</h3>
            <button 
              (click)="closeDetails()"
              type="button"
              aria-label="Cerrar modal"
              class="text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-bg-tertiary">
              <i class="gg-close text-lg" aria-hidden="true"></i>
            </button>
          </div>
          
          <!-- Content -->
          <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <!-- Image -->
            <div *ngIf="selectedItem.imageUrl" class="relative rounded-lg overflow-hidden">
              <img 
                [src]="selectedItem.hdImageUrl || selectedItem.imageUrl" 
                [alt]="selectedItem.title"
                class="w-full h-auto max-h-96 object-contain bg-black">
              
              <div class="absolute top-2 right-2">
                <span 
                  class="px-3 py-1 rounded-full text-xs"
                  [ngClass]="getStatusClass(selectedItem.status)">
                  {{ selectedItem.status }}
                </span>
              </div>
            </div>

            <!-- Explanation -->
            <div>
              <label class="block text-text-secondary text-sm font-medium mb-2">Explicación</label>
              <p class="text-text-primary leading-relaxed">{{ selectedItem.explanation }}</p>
            </div>

            <!-- Metadata Grid -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-text-secondary text-sm font-medium mb-1">ID</label>
                <p class="text-text-primary font-mono">{{ selectedItem.id }}</p>
              </div>
              <div>
                <label class="block text-text-secondary text-sm font-medium mb-1">Fecha</label>
                <p class="text-text-primary">{{ formatDate(selectedItem.requestedDate) }}</p>
              </div>
              <div>
                <label class="block text-text-secondary text-sm font-medium mb-1">Tipo de Media</label>
                <span class="px-2 py-1 bg-php-purple/20 text-php-purple rounded-full text-xs">
                  {{ selectedItem.mediaType }}
                </span>
              </div>
              <div>
                <label class="block text-text-secondary text-sm font-medium mb-1">Estado</label>
                <span 
                  class="px-2 py-1 rounded-full text-xs"
                  [ngClass]="getStatusClass(selectedItem.status)">
                  {{ selectedItem.status }}
                </span>
              </div>
            </div>

            <!-- Copyright -->
            <div *ngIf="selectedItem.copyright">
              <label class="block text-text-secondary text-sm font-medium mb-1">Copyright</label>
              <p class="text-text-primary">© {{ selectedItem.copyright }}</p>
            </div>

            <!-- Links -->
            <div *ngIf="selectedItem.imageUrl" class="flex gap-2">
              <a 
                [href]="selectedItem.imageUrl" 
                target="_blank"
                class="px-4 py-2 bg-php-purple/20 text-php-purple rounded-lg hover:bg-php-purple/30 transition-colors text-sm">
                Ver Imagen Original
              </a>
              <a 
                *ngIf="selectedItem.hdImageUrl"
                [href]="selectedItem.hdImageUrl" 
                target="_blank"
                class="px-4 py-2 bg-php-purple text-white rounded-lg hover:bg-php-dark-purple transition-colors text-sm">
                Ver en HD
              </a>
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
export class NasaApodHistoryComponent implements OnInit {
  history: NasaApodHistoryItem[] = [];
  filteredHistory: NasaApodHistoryItem[] = [];
  selectedMediaType: string = 'all';
  searchTitle: string = '';
  totalCount: number = 0;
  isLoading: boolean = false;
  error: string | null = null;

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalPages: number = 0;

  // Modal
  selectedItem: NasaApodHistoryItem | null = null;

  // Delete dialog
  showDeleteDialog: boolean = false;
  deleteDialogTitle: string = '';
  deleteDialogMessage: string = '';
  deleteAction: (() => void) | null = null;

  // Search debounce
  private searchSubject = new Subject<string>();

  constructor(
    private nasaApodService: NasaApodService,
    private router: Router,
    private toastService: ToastService
  ) {
    // Setup search debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  ngOnInit(): void {
    this.loadHistory();
    this.loadCount();
  }

  loadHistory(filters?: NasaHistoryFilters): void {
    this.isLoading = true;
    this.error = null;

    console.log('🔍 Cargando historial de NASA APOD...', filters || 'Sin filtros');

    this.nasaApodService.getHistory(filters).subscribe({
      next: (data) => {
        console.log('✅ Historial NASA recibido:', data);
        console.log('📊 Total de registros:', data?.length || 0);
        this.history = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar historial NASA:', error);
        this.error = error.message || 'Error al cargar el historial';
        this.isLoading = false;
        this.toastService.showError('Error al cargar el historial');
      }
    });
  }

  loadCount(): void {
    console.log('🔢 Cargando contador de historial NASA...');
    this.nasaApodService.getHistoryCount().subscribe({
      next: (count) => {
        console.log('✅ Contador NASA recibido:', count);
        this.totalCount = count;
      },
      error: (error) => {
        console.error('❌ Error loading NASA count:', error);
      }
    });
  }

  filterByMediaType(): void {
    this.applyFilters();
    this.currentPage = 1;
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  performSearch(searchTerm: string): void {
    if (searchTerm.trim()) {
      this.nasaApodService.searchByTitle(searchTerm).subscribe({
        next: (data) => {
          this.filteredHistory = data;
          this.calculatePagination();
        },
        error: (error) => {
          this.error = error.message || 'Error al buscar';
        }
      });
    } else {
      this.applyFilters();
    }
  }

  applyFilters(): void {
    let filtered = [...this.history];

    // Filter by media type
    if (this.selectedMediaType !== 'all') {
      filtered = filtered.filter(item => item.mediaType === this.selectedMediaType);
    }

    this.filteredHistory = filtered;
    this.calculatePagination();
  }

  deleteItem(id: number): void {
    this.deleteDialogTitle = '¿Eliminar imagen?';
    this.deleteDialogMessage = '¿Estás seguro de que deseas eliminar esta imagen del historial? Esta acción no se puede deshacer.';
    this.deleteAction = () => this.performDeleteItem(id);
    this.showDeleteDialog = true;
  }

  performDeleteItem(id: number): void {
    this.nasaApodService.deleteHistoryItem(id).subscribe({
      next: () => {
        this.history = this.history.filter(item => item.id !== id);
        this.applyFilters();
        this.loadCount();
        this.toastService.showSuccess('Imagen eliminada exitosamente');
      },
      error: (error) => {
        this.error = error.message || 'Error al eliminar la imagen';
        this.toastService.showError('Error al eliminar la imagen');
      }
    });
  }

  openDeleteAllDialog(): void {
    this.deleteDialogTitle = '¿Eliminar todo el historial?';
    this.deleteDialogMessage = '¿Estás seguro de que deseas eliminar todas las imágenes del historial? Esta acción no se puede deshacer.';
    this.deleteAction = () => this.performDeleteAll();
    this.showDeleteDialog = true;
  }

  performDeleteAll(): void {
    this.nasaApodService.deleteAllHistory().subscribe({
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

  viewDetails(item: NasaApodHistoryItem): void {
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

  get paginatedHistory(): NasaApodHistoryItem[] {
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

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'SUCCESS': 'bg-green-500/20 text-green-400 border border-green-500/30',
      'ERROR': 'bg-red-500/20 text-red-400 border border-red-500/30'
    };
    return classes[status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
  }

  navigateToApod(): void {
    this.router.navigate(['/nasa-apod']);
  }
}
