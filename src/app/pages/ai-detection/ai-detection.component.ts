import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiDetectionQuery, CreateAiDetectionQuery } from '../../core/models/ai-detection.model';
import { PaginatedResponse } from '../../core/models/common.model';
import { AiDetectionService } from '../../core/services/ai-detection.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-ai-detection',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, LoadingComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-text-primary">Detección de IA</h1>
          <p class="text-text-muted mt-1">Analiza y gestiona la detección de contenido generado por IA</p>
        </div>
        <div class="flex space-x-3">
          <button 
            (click)="openCreateModal()"
            class="px-4 py-2 card-green text-white rounded-lg hover:opacity-90 transition-all hover-lift">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Nueva Detección
          </button>
          <button 
            (click)="openQuickDetectModal()"
            class="px-4 py-2 bg-php-purple text-white rounded-lg hover:bg-php-dark-purple transition-colors hover-lift neon-glow">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Detección Rápida
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-bg-secondary rounded-xl p-6 border border-php-purple/20 glass-effect">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-muted text-sm">Total Consultas</p>
              <p class="text-2xl font-bold text-text-primary mt-1">{{ totalQueries }}</p>
            </div>
            <div class="w-12 h-12 card-green rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-bg-secondary rounded-xl p-6 border border-php-purple/20 glass-effect">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-muted text-sm">Generado por IA</p>
              <p class="text-2xl font-bold text-text-primary mt-1">{{ aiGeneratedCount }}</p>
            </div>
            <div class="w-12 h-12 card-orange rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-bg-secondary rounded-xl p-6 border border-php-purple/20 glass-effect">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-muted text-sm">Escrito por Humano</p>
              <p class="text-2xl font-bold text-text-primary mt-1">{{ humanWrittenCount }}</p>
            </div>
            <div class="w-12 h-12 card-blue rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-bg-secondary rounded-xl p-4 border border-php-purple/20 glass-effect">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex items-center space-x-2">
            <label class="text-text-secondary text-sm">Idioma:</label>
            <select [(ngModel)]="filters.lang" (change)="applyFilters()" 
                    class="bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-1 text-text-primary text-sm focus:outline-none focus:border-php-purple">
              <option value="">Todos</option>
              <option value="en">Inglés</option>
              <option value="es">Español</option>
              <option value="fr">Francés</option>
            </select>
          </div>
          
          <div class="flex items-center space-x-2">
            <label class="text-text-secondary text-sm">Clasificación:</label>
            <select [(ngModel)]="filters.classification" (change)="applyFilters()"
                    class="bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-1 text-text-primary text-sm focus:outline-none focus:border-php-purple">
              <option value="">Todas</option>
              <option value="AI_GENERATED">Generado por IA</option>
              <option value="HUMAN_WRITTEN">Escrito por Humano</option>
            </select>
          </div>
          
          <div class="flex items-center space-x-2">
            <input [(ngModel)]="filters.textContains" (input)="applyFilters()" 
                   placeholder="Buscar texto..."
                   class="bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-1 text-text-primary text-sm focus:outline-none focus:border-php-purple">
          </div>
          
          <button (click)="clearFilters()" 
                  class="px-3 py-1 bg-php-purple/20 text-php-purple rounded-lg hover:bg-php-purple/30 transition-colors text-sm">
            Limpiar
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-bg-secondary rounded-xl border border-php-purple/20 glass-effect overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-bg-tertiary border-b border-php-purple/20">
              <tr>
                <th class="text-left p-4 text-text-secondary font-medium">ID</th>
                <th class="text-left p-4 text-text-secondary font-medium">Vista Previa</th>
                <th class="text-left p-4 text-text-secondary font-medium">Idioma</th>
                <th class="text-left p-4 text-text-secondary font-medium">Probabilidad IA</th>
                <th class="text-left p-4 text-text-secondary font-medium">Clasificación</th>
                <th class="text-left p-4 text-text-secondary font-medium">Creado</th>
                <th class="text-left p-4 text-text-secondary font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="loading" class="border-b border-php-purple/10">
                <td colspan="7" class="p-4">
                  <app-loading></app-loading>
                </td>
              </tr>
              
              <tr *ngFor="let query of queries" class="border-b border-php-purple/10 hover:bg-bg-tertiary/50 transition-colors">
                <td class="p-4 text-text-primary font-mono text-sm">{{ query.id }}</td>
                <td class="p-4 text-text-primary max-w-xs">
                  <div class="truncate">{{ query.text }}</div>
                </td>
                <td class="p-4">
                  <span class="px-2 py-1 bg-php-purple/20 text-php-purple rounded-full text-xs">
                    {{ query.lang || 'N/A' }}
                  </span>
                </td>
                <td class="p-4">
                  <div class="flex items-center space-x-2">
                    <div class="w-16 bg-bg-tertiary rounded-full h-2">
                      <div class="h-2 rounded-full transition-all" 
                           [style.width.%]="query.aiProbability * 100"
                           [class]="getProbabilityColor(query.aiProbability)"></div>
                    </div>
                    <span class="text-text-primary text-sm">{{ (query.aiProbability * 100).toFixed(1) }}%</span>
                  </div>
                </td>
                <td class="p-4">
                  <span class="px-2 py-1 rounded-full text-xs" [class]="getClassificationColor(query.classification)">
                    {{ query.classification }}
                  </span>
                </td>
                <td class="p-4 text-text-muted text-sm">
                  {{ formatDate(query.createdAt) }}
                </td>
                <td class="p-4">
                  <div class="flex space-x-2">
                    <button (click)="viewQuery(query)" 
                            class="p-1 text-text-muted hover:text-php-purple transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    <button (click)="editQuery(query)" 
                            class="p-1 text-text-muted hover:text-card-blue transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button (click)="deleteQuery(query)" 
                            class="p-1 text-text-muted hover:text-error transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              
              <tr *ngIf="!loading && queries.length === 0" class="border-b border-php-purple/10">
                <td colspan="7" class="p-8 text-center text-text-muted">
                  <span class="text-2xl mb-2 block">🔍</span>
                  No queries found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="flex items-center justify-between p-4 border-t border-php-purple/20" *ngIf="pagination">
          <div class="text-text-muted text-sm">
            Showing {{ (pagination.page * pagination.size) + 1 }} to 
            {{ Math.min((pagination.page + 1) * pagination.size, pagination.totalElements) }} 
            of {{ pagination.totalElements }} results
          </div>
          
          <div class="flex space-x-2">
            <button (click)="previousPage()" [disabled]="pagination.first"
                    class="px-3 py-1 bg-bg-tertiary border border-php-purple/20 rounded-lg text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-php-purple/20 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            <span class="px-3 py-1 bg-php-purple/20 text-php-purple rounded-lg text-sm">
              {{ pagination.page + 1 }} / {{ pagination.totalPages }}
            </span>
            
            <button (click)="nextPage()" [disabled]="pagination.last"
                    class="px-3 py-1 bg-bg-tertiary border border-php-purple/20 rounded-lg text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-php-purple/20 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <app-modal [isOpen]="showCreateModal" [title]="editingQuery ? 'Edit AI Detection Query' : 'Create AI Detection Query'" (close)="closeCreateModal()">
      <form (ngSubmit)="saveQuery()" #queryForm="ngForm">
        <div class="space-y-4">
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2">Text to Analyze *</label>
            <textarea [(ngModel)]="formData.text" name="text" required
                      rows="4" placeholder="Enter text to analyze for AI detection..."
                      class="w-full bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-php-purple resize-none"></textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-text-secondary text-sm font-medium mb-2">Language</label>
              <select [(ngModel)]="formData.lang" name="lang"
                      class="w-full bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-php-purple">
                <option value="">Auto-detect</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            
            <div>
              <label class="block text-text-secondary text-sm font-medium mb-2">Classification</label>
              <div class="w-full bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-2 text-text-muted">
                Auto-detected by AI
              </div>
              <p class="text-xs text-text-muted mt-1">The classification will be determined automatically based on the text analysis</p>
            </div>
          </div>
          
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2">AI Probability</label>
            <div class="w-full bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-2 text-text-muted">
              Auto-calculated by AI
            </div>
            <p class="text-xs text-text-muted mt-1">The probability will be calculated automatically during analysis</p>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button type="button" (click)="closeCreateModal()"
                  class="px-4 py-2 bg-bg-tertiary text-text-primary rounded-lg hover:bg-bg-tertiary/80 transition-colors">
            Cancel
          </button>
          <button type="submit" [disabled]="!queryForm.form.valid || saving"
                  class="px-4 py-2 card-green text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50">
            <span *ngIf="saving" class="animate-spin mr-2 text-sm">⏳</span>
            {{ editingQuery ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </app-modal>

    <!-- Quick Detect Modal -->
    <app-modal [isOpen]="showQuickDetectModal" title="Quick AI Detection" (close)="closeQuickDetectModal()">
      <form (ngSubmit)="quickDetect()" #detectForm="ngForm">
        <div class="space-y-4">
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2">Text to Analyze *</label>
            <textarea [(ngModel)]="quickDetectData.text" name="text" required
                      rows="4" placeholder="Paste text here for instant AI detection..."
                      class="w-full bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-php-purple resize-none"></textarea>
          </div>
          
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2">Language</label>
            <select [(ngModel)]="quickDetectData.lang" name="lang"
                    class="w-full bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-php-purple">
              <option value="">Auto-detect</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          
          <!-- Results -->
          <div *ngIf="quickDetectResult" class="mt-6 p-4 bg-bg-tertiary rounded-lg border border-php-purple/20">
            <h4 class="text-text-primary font-medium mb-3">Detection Result</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-text-secondary">AI Probability:</span>
                <div class="flex items-center space-x-2">
                  <div class="w-20 bg-bg-secondary rounded-full h-2">
                    <div class="h-2 rounded-full transition-all" 
                         [style.width.%]="quickDetectResult.aiProbability * 100"
                         [class]="getProbabilityColor(quickDetectResult.aiProbability)"></div>
                  </div>
                  <span class="text-text-primary text-sm font-medium">{{ (quickDetectResult.aiProbability * 100).toFixed(1) }}%</span>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-text-secondary">Classification:</span>
                <span class="px-2 py-1 rounded-full text-xs" [class]="getClassificationColor(quickDetectResult.classification)">
                  {{ quickDetectResult.classification }}
                </span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-text-secondary">Language:</span>
                <span class="text-text-primary">{{ quickDetectResult.lang || 'Auto-detected' }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button type="button" (click)="closeQuickDetectModal()"
                  class="px-4 py-2 bg-bg-tertiary text-text-primary rounded-lg hover:bg-bg-tertiary/80 transition-colors">
            Close
          </button>
          <button type="submit" [disabled]="!detectForm.form.valid || detecting"
                  class="px-4 py-2 bg-php-purple text-white rounded-lg hover:bg-php-dark-purple transition-colors disabled:opacity-50">
            <span *ngIf="detecting" class="animate-spin mr-2 text-sm">⏳</span>
            Analyze
          </button>
        </div>
      </form>
    </app-modal>

    <!-- View Modal -->
    <app-modal [isOpen]="showViewModal" title="Query Details" (close)="closeViewModal()">
      <div *ngIf="selectedQuery" class="space-y-4">
        <div>
          <label class="block text-text-secondary text-sm font-medium mb-1">ID</label>
          <p class="text-text-primary font-mono">{{ selectedQuery.id }}</p>
        </div>
        
        <div>
          <label class="block text-text-secondary text-sm font-medium mb-1">Text</label>
          <div class="bg-bg-tertiary rounded-lg p-3 text-text-primary text-sm max-h-32 overflow-y-auto">
            {{ selectedQuery.text }}
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-1">Language</label>
            <p class="text-text-primary">{{ selectedQuery.lang || 'N/A' }}</p>
          </div>
          
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-1">Created</label>
            <p class="text-text-primary">{{ formatDate(selectedQuery.createdAt) }}</p>
          </div>
        </div>
        
        <div>
          <label class="block text-text-secondary text-sm font-medium mb-1">AI Probability</label>
          <div class="flex items-center space-x-3">
            <div class="flex-1 bg-bg-secondary rounded-full h-3">
              <div class="h-3 rounded-full transition-all" 
                   [style.width.%]="selectedQuery.aiProbability * 100"
                   [class]="getProbabilityColor(selectedQuery.aiProbability)"></div>
            </div>
            <span class="text-text-primary font-medium">{{ (selectedQuery.aiProbability * 100).toFixed(1) }}%</span>
          </div>
        </div>
        
        <div>
          <label class="block text-text-secondary text-sm font-medium mb-1">Classification</label>
          <span class="px-3 py-1 rounded-full text-sm" [class]="getClassificationColor(selectedQuery.classification)">
            {{ selectedQuery.classification }}
          </span>
        </div>
      </div>
      
      <div class="flex justify-end mt-6">
        <button (click)="closeViewModal()"
                class="px-4 py-2 bg-php-purple text-white rounded-lg hover:bg-php-dark-purple transition-colors">
          Close
        </button>
      </div>
    </app-modal>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AiDetectionComponent implements OnInit {
  queries: AiDetectionQuery[] = [];
  pagination: PaginatedResponse<AiDetectionQuery> | null = null;
  loading = false;
  saving = false;
  detecting = false;

  // Stats
  totalQueries = 0;
  aiGeneratedCount = 0;
  humanWrittenCount = 0;

  // Modals
  showCreateModal = false;
  showQuickDetectModal = false;
  showViewModal = false;
  editingQuery: AiDetectionQuery | null = null;
  selectedQuery: AiDetectionQuery | null = null;

  // Forms
  formData: CreateAiDetectionQuery = { text: '' };
  quickDetectData = { text: '', lang: '' };
  quickDetectResult: any = null;

  // Filters
  filters = {
    lang: '',
    classification: '',
    textContains: '',
    page: 0,
    size: 10
  };

  constructor(private aiDetectionService: AiDetectionService) { }

  ngOnInit() {
    this.loadQueries();
  }



  loadQueries() {
    this.loading = true;

    // Try to load with search first, if it fails, try the basic getQueries
    this.aiDetectionService.searchQueries(this.filters).subscribe({
      next: (response) => {
        this.pagination = response;
        this.queries = response.content || [];
        this.totalQueries = response.totalElements || 0;
        this.calculateStats();
        this.loading = false;
      },
      error: (searchError) => {
        console.warn('Search queries failed, trying basic getQueries:', searchError);

        // Fallback to basic getQueries
        this.aiDetectionService.getQueries(this.filters.page, this.filters.size).subscribe({
          next: (response) => {
            this.pagination = response;
            this.queries = response.content || [];
            this.totalQueries = response.totalElements || 0;
            this.calculateStats();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading queries:', error);
            this.loading = false;
            // Show empty state
            this.queries = [];
            this.pagination = null;
          }
        });
      }
    });
  }

  calculateStats() {
    if (!this.queries || !Array.isArray(this.queries)) {
      this.queries = [];
      this.aiGeneratedCount = 0;
      this.humanWrittenCount = 0;
      return;
    }

    this.aiGeneratedCount = this.queries.filter(q => q.classification === 'AI_GENERATED').length;
    this.humanWrittenCount = this.queries.filter(q => q.classification === 'HUMAN_WRITTEN').length;
  }

  applyFilters() {
    this.filters.page = 0;
    this.loadQueries();
  }

  clearFilters() {
    this.filters = {
      lang: '',
      classification: '',
      textContains: '',
      page: 0,
      size: 10
    };
    this.loadQueries();
  }

  nextPage() {
    if (this.pagination && !this.pagination.last) {
      this.filters.page++;
      this.loadQueries();
    }
  }

  previousPage() {
    if (this.pagination && !this.pagination.first) {
      this.filters.page--;
      this.loadQueries();
    }
  }

  openCreateModal() {
    this.editingQuery = null;
    this.formData = { text: '' };
    this.showCreateModal = true;
  }

  editQuery(query: AiDetectionQuery) {
    this.editingQuery = query;
    this.formData = {
      text: query.text,
      lang: query.lang,
      classification: query.classification,
      aiProbability: query.aiProbability
    };
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.editingQuery = null;
    this.formData = { text: '' };
  }

  saveQuery() {
    this.saving = true;

    if (this.editingQuery) {
      // For editing, use the update endpoint
      this.aiDetectionService.updateQuery(this.editingQuery.id, this.formData).subscribe({
        next: () => {
          this.saving = false;
          this.closeCreateModal();
          this.loadQueries();
        },
        error: (error) => {
          console.error('Error updating query:', error);
          this.saving = false;
        }
      });
    } else {
      // For new queries, first detect AI, then create the query
      this.aiDetectionService.detectAI(this.formData.text, this.formData.lang).subscribe({
        next: (detectionResult) => {
          // Create query with the detection results
          const queryData: CreateAiDetectionQuery = {
            text: this.formData.text,
            lang: detectionResult.lang || this.formData.lang,
            aiProbability: detectionResult.aiProbability,
            classification: detectionResult.classification
          };

          this.aiDetectionService.createQuery(queryData).subscribe({
            next: () => {
              this.saving = false;
              this.closeCreateModal();
              this.loadQueries();
            },
            error: (error) => {
              console.error('Error creating query:', error);
              this.saving = false;
            }
          });
        },
        error: (error) => {
          console.error('Error detecting AI:', error);
          this.saving = false;
        }
      });
    }
  }

  deleteQuery(query: AiDetectionQuery) {
    if (confirm('Are you sure you want to delete this query?')) {
      this.aiDetectionService.deleteQuery(query.id).subscribe({
        next: () => {
          this.loadQueries();
        },
        error: (error) => {
          console.error('Error deleting query:', error);
        }
      });
    }
  }

  viewQuery(query: AiDetectionQuery) {
    this.selectedQuery = query;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedQuery = null;
  }

  openQuickDetectModal() {
    this.quickDetectData = { text: '', lang: '' };
    this.quickDetectResult = null;
    this.showQuickDetectModal = true;
  }

  closeQuickDetectModal() {
    this.showQuickDetectModal = false;
    this.quickDetectData = { text: '', lang: '' };
    this.quickDetectResult = null;
  }

  quickDetect() {
    this.detecting = true;
    this.aiDetectionService.detectAI(this.quickDetectData.text, this.quickDetectData.lang).subscribe({
      next: (result) => {
        this.quickDetectResult = result;
        this.detecting = false;
      },
      error: (error) => {
        console.error('Error detecting AI:', error);
        this.detecting = false;
      }
    });
  }

  getProbabilityColor(probability: number): string {
    if (probability >= 0.7) return 'bg-error';
    if (probability >= 0.4) return 'bg-warning';
    return 'bg-success';
  }

  getClassificationColor(classification: string): string {
    switch (classification) {
      case 'AI_GENERATED':
        return 'bg-error/20 text-error';
      case 'HUMAN_WRITTEN':
        return 'bg-success/20 text-success';
      default:
        return 'bg-php-purple/20 text-php-purple';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  Math = Math;
}