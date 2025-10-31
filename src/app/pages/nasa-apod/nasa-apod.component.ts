import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginatedResponse } from '../../core/models/common.model';
import {
  CreateNasaApodQuery,
  NasaApodQuery,
} from '../../core/models/nasa-apod.model';
import { NasaApodService } from '../../core/services/nasa-apod.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-nasa-apod',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, LoadingComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-text-primary">NASA APOD</h1>
          <p class="text-text-muted mt-1">
            Colección de Imágenes Astronómicas del Día
          </p>
        </div>
        <div class="flex space-x-3">
          <button
            (click)="openCreateModal()"
            class="px-4 py-2 card-orange text-white rounded-lg hover:opacity-90 transition-all hover-lift"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Agregar Entrada
          </button>
          <button
            (click)="getTodayApod()"
            class="px-4 py-2 bg-php-purple text-white rounded-lg hover:bg-php-dark-purple transition-colors hover-lift neon-glow"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            APOD de Hoy
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          class="bg-bg-secondary rounded-xl p-6 border border-php-purple/20 glass-effect"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-muted text-sm">Total Imágenes</p>
              <p class="text-2xl font-bold text-text-primary mt-1">
                {{ totalImages }}
              </p>
            </div>
            <div
              class="w-12 h-12 card-orange rounded-lg flex items-center justify-center"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div
          class="bg-bg-secondary rounded-xl p-6 border border-php-purple/20 glass-effect"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-muted text-sm">Videos</p>
              <p class="text-2xl font-bold text-text-primary mt-1">
                {{ videoCount }}
              </p>
            </div>
            <div
              class="w-12 h-12 card-blue rounded-lg flex items-center justify-center"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 4h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div
          class="bg-bg-secondary rounded-xl p-6 border border-php-purple/20 glass-effect"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-muted text-sm">Este Mes</p>
              <p class="text-2xl font-bold text-text-primary mt-1">
                {{ thisMonthCount }}
              </p>
            </div>
            <div
              class="w-12 h-12 card-green rounded-lg flex items-center justify-center"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div
          class="bg-bg-secondary rounded-xl p-6 border border-php-purple/20 glass-effect"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-muted text-sm">Tasa de Éxito</p>
              <p class="text-2xl font-bold text-text-primary mt-1">
                {{ successRate }}%
              </p>
            </div>
            <div
              class="w-12 h-12 card-purple rounded-lg flex items-center justify-center"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div
        class="bg-bg-secondary rounded-xl p-4 border border-php-purple/20 glass-effect"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex items-center space-x-2">
            <label class="text-text-secondary text-sm">Tipo de Media:</label>
            <select
              [(ngModel)]="filters.mediaType"
              (change)="applyFilters()"
              class="bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-1 text-text-primary text-sm focus:outline-none focus:border-php-purple"
            >
              <option value="">Todos</option>
              <option value="image">Imágenes</option>
              <option value="video">Videos</option>
            </select>
          </div>

          <div class="flex items-center space-x-2">
            <label class="text-text-secondary text-sm">Estado:</label>
            <select
              [(ngModel)]="filters.status"
              (change)="applyFilters()"
              class="bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-1 text-text-primary text-sm focus:outline-none focus:border-php-purple"
            >
              <option value="">Todos</option>
              <option value="SUCCESS">Éxito</option>
              <option value="ERROR">Error</option>
              <option value="PENDING">Pendiente</option>
            </select>
          </div>

          <div class="flex items-center space-x-2">
            <input
              [(ngModel)]="filters.titleContains"
              (input)="applyFilters()"
              placeholder="Buscar título..."
              class="bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-1 text-text-primary text-sm focus:outline-none focus:border-php-purple"
            />
          </div>

          <div class="flex items-center space-x-2">
            <label class="text-text-secondary text-sm">Fecha Desde:</label>
            <input
              type="date"
              [(ngModel)]="filters.requestedDateFrom"
              (change)="applyFilters()"
              class="bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-1 text-text-primary text-sm focus:outline-none focus:border-php-purple"
            />
          </div>

          <button
            (click)="clearFilters()"
            class="px-3 py-1 bg-php-purple/20 text-php-purple rounded-lg hover:bg-php-purple/30 transition-colors text-sm"
          >
            Limpiar
          </button>
        </div>
      </div>

      <!-- Grid View -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        *ngIf="!loading && queries.length > 0"
      >
        <div
          *ngFor="let query of queries"
          class="bg-bg-secondary rounded-xl border border-php-purple/20 glass-effect overflow-hidden hover-lift group"
        >
          <!-- Image/Video -->
          <div class="relative h-48 bg-bg-tertiary">
            <img
              *ngIf="query.mediaType === 'image' && query.imageUrl"
              [src]="query.imageUrl"
              [alt]="query.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              (error)="onImageError($event)"
            />

            <div
              *ngIf="query.mediaType === 'video' || !query.imageUrl"
              class="w-full h-full flex items-center justify-center"
            >
              <svg class="w-16 h-16 text-php-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 4h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>

            <!-- Status Badge -->
            <div class="absolute top-2 right-2">
              <span
                class="px-2 py-1 rounded-full text-xs"
                [class]="getStatusColor(query.status)"
              >
                {{ query.status }}
              </span>
            </div>

            <!-- Media Type Badge -->
            <div class="absolute top-2 left-2">
              <span
                class="px-2 py-1 bg-black/50 text-white rounded-full text-xs"
              >
                {{ query.mediaType }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <div class="flex items-start justify-between mb-2">
              <h3
                class="text-text-primary font-semibold text-sm line-clamp-2 flex-1"
              >
                {{ query.title }}
              </h3>
              <span class="text-text-muted text-xs ml-2 whitespace-nowrap"
                >ID: {{ query.id }}</span
              >
            </div>

            <p class="text-text-muted text-xs mb-3 line-clamp-3">
              {{ query.explanation }}
            </p>

            <div class="flex items-center justify-between text-xs">
              <span class="text-text-muted">{{
                formatDate(query.requestedDate)
              }}</span>
              <div class="flex space-x-1">
                <button
                  (click)="viewQuery(query)"
                  class="p-1 text-text-muted hover:text-php-purple transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
                <button
                  (click)="editQuery(query)"
                  class="p-1 text-text-muted hover:text-card-blue transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  (click)="deleteQuery(query)"
                  class="p-1 text-text-muted hover:text-error transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        *ngIf="loading"
        class="bg-bg-secondary rounded-xl p-8 border border-php-purple/20 glass-effect"
      >
        <app-loading></app-loading>
      </div>

      <!-- Empty State -->
      <div
        *ngIf="!loading && queries.length === 0"
        class="bg-bg-secondary rounded-xl p-8 border border-php-purple/20 glass-effect text-center"
      >
        <svg class="w-16 h-16 text-text-muted mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <h3 class="text-text-primary font-semibold mb-2">
          No se encontraron entradas APOD
        </h3>
        <p class="text-text-muted mb-4">
          Start by fetching today's Astronomy Picture of the Day
        </p>
        <button
          (click)="getTodayApod()"
          class="px-4 py-2 bg-php-purple text-white rounded-lg hover:bg-php-dark-purple transition-colors"
        >
          Obtener APOD de Hoy
        </button>
      </div>

      <!-- Pagination -->
      <div
        class="flex items-center justify-between"
        *ngIf="pagination && queries.length > 0"
      >
        <div class="text-text-muted text-sm">
          Showing {{ pagination.page * pagination.size + 1 }} to
          {{
            Math.min(
              (pagination.page + 1) * pagination.size,
              pagination.totalElements
            )
          }}
          of {{ pagination.totalElements }} results
        </div>

        <div class="flex space-x-2">
          <button
            (click)="previousPage()"
            [disabled]="pagination.first"
            class="px-3 py-1 bg-bg-secondary border border-php-purple/20 rounded-lg text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-php-purple/20 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <span
            class="px-3 py-1 bg-php-purple/20 text-php-purple rounded-lg text-sm"
          >
            {{ pagination.page + 1 }} / {{ pagination.totalPages }}
          </span>

          <button
            (click)="nextPage()"
            [disabled]="pagination.last"
            class="px-3 py-1 bg-bg-secondary border border-php-purple/20 rounded-lg text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-php-purple/20 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <app-modal
      [isOpen]="showCreateModal"
      [title]="editingQuery ? 'Editar Entrada NASA APOD' : 'Crear Entrada NASA APOD'"
      (close)="closeCreateModal()"
    >
      <form (ngSubmit)="saveQuery()" #queryForm="ngForm">
        <div class="space-y-4">
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2"
              >Fecha Solicitada *</label
            >
            <input
              type="date"
              [(ngModel)]="formData.requestedDate"
              name="requestedDate"
              required
              class="w-full bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-php-purple"
            />
          </div>

          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2"
              >Título</label
            >
            <input
              type="text"
              [(ngModel)]="formData.title"
              name="title"
              placeholder="Ingresa el título..."
              class="w-full bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-php-purple"
            />
          </div>

          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2"
              >Explicación</label
            >
            <textarea
              [(ngModel)]="formData.explanation"
              name="explanation"
              rows="3"
              placeholder="Ingresa la explicación..."
              class="w-full bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-php-purple resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-text-secondary text-sm font-medium mb-2"
                >Tipo de Media</label
              >
              <select
                [(ngModel)]="formData.mediaType"
                name="mediaType"
                class="w-full bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-php-purple"
              >
                <option value="">Select type</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <label class="block text-text-secondary text-sm font-medium mb-2"
                >Estado</label
              >
              <select
                [(ngModel)]="formData.status"
                name="status"
                class="w-full bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-php-purple"
              >
                <option value="">Seleccionar estado</option>
                <option value="SUCCESS">Éxito</option>
                <option value="ERROR">Error</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2"
              >URL de Imagen</label
            >
            <input
              type="url"
              [(ngModel)]="formData.imageUrl"
              name="imageUrl"
              placeholder="https://..."
              class="w-full bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-php-purple"
            />
          </div>

          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2"
              >URL de Imagen HD</label
            >
            <input
              type="url"
              [(ngModel)]="formData.hdImageUrl"
              name="hdImageUrl"
              placeholder="https://..."
              class="w-full bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-php-purple"
            />
          </div>

          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2"
              >Derechos de Autor</label
            >
            <input
              type="text"
              [(ngModel)]="formData.copyright"
              name="copyright"
              placeholder="Información de derechos de autor..."
              class="w-full bg-bg-tertiary border border-php-purple/20 rounded-lg px-3 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-php-purple"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            (click)="closeCreateModal()"
            class="px-4 py-2 bg-bg-tertiary text-text-primary rounded-lg hover:bg-bg-tertiary/80 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            [disabled]="!queryForm.form.valid || saving"
            class="px-4 py-2 card-orange text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
          >
            <svg *ngIf="saving" class="w-4 h-4 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            {{ editingQuery ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </form>
    </app-modal>

    <!-- View Modal -->
    <app-modal
      [isOpen]="showViewModal"
      title="Detalles APOD"
      (close)="closeViewModal()"
    >
      <div *ngIf="selectedQuery" class="space-y-4">
        <!-- Image -->
        <div *ngIf="selectedQuery.imageUrl" class="relative">
          <img
            [src]="selectedQuery.hdImageUrl || selectedQuery.imageUrl"
            [alt]="selectedQuery.title"
            class="w-full max-h-64 object-cover rounded-lg"
          />
          <div class="absolute top-2 right-2">
            <span
              class="px-2 py-1 rounded-full text-xs"
              [class]="getStatusColor(selectedQuery.status)"
            >
              {{ selectedQuery.status }}
            </span>
          </div>
        </div>

        <div>
          <label class="block text-text-secondary text-sm font-medium mb-1"
            >Title</label
          >
          <h3 class="text-text-primary font-semibold">
            {{ selectedQuery.title }}
          </h3>
        </div>

        <div>
          <label class="block text-text-secondary text-sm font-medium mb-1"
            >Explanation</label
          >
          <div
            class="bg-bg-tertiary rounded-lg p-3 text-text-primary text-sm max-h-32 overflow-y-auto"
          >
            {{ selectedQuery.explanation }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-1"
              >Fecha</label
            >
            <p class="text-text-primary">
              {{ formatDate(selectedQuery.requestedDate) }}
            </p>
          </div>

          <div>
            <label class="block text-text-secondary text-sm font-medium mb-1"
              >Media Type</label
            >
            <p class="text-text-primary">{{ selectedQuery.mediaType }}</p>
          </div>
        </div>

        <div *ngIf="selectedQuery.copyright">
          <label class="block text-text-secondary text-sm font-medium mb-1"
            >Copyright</label
          >
          <p class="text-text-primary text-sm">{{ selectedQuery.copyright }}</p>
        </div>

        <div class="flex space-x-2" *ngIf="selectedQuery.imageUrl">
          <a
            [href]="selectedQuery.imageUrl"
            target="_blank"
            class="px-3 py-1 bg-php-purple/20 text-php-purple rounded-lg hover:bg-php-purple/30 transition-colors text-sm"
          >
            Ver Imagen
          </a>
          <a
            *ngIf="selectedQuery.hdImageUrl"
            [href]="selectedQuery.hdImageUrl"
            target="_blank"
            class="px-3 py-1 bg-php-purple/20 text-php-purple rounded-lg hover:bg-php-purple/30 transition-colors text-sm"
          >
            Ver HD
          </a>
        </div>
      </div>

      <div class="flex justify-end mt-6">
        <button
          (click)="closeViewModal()"
          class="px-4 py-2 bg-php-purple text-white rounded-lg hover:bg-php-dark-purple transition-colors"
        >
          Cerrar
        </button>
      </div>
    </app-modal>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `,
  ],
})
export class NasaApodComponent implements OnInit {
  queries: NasaApodQuery[] = [];
  pagination: PaginatedResponse<NasaApodQuery> | null = null;
  loading = false;
  saving = false;

  // Stats
  totalImages = 0;
  videoCount = 0;
  thisMonthCount = 0;
  successRate = 0;

  // Modals
  showCreateModal = false;
  showViewModal = false;
  editingQuery: NasaApodQuery | null = null;
  selectedQuery: NasaApodQuery | null = null;

  // Forms
  formData: CreateNasaApodQuery = { requestedDate: '' };

  // Filters
  filters = {
    mediaType: '',
    status: '',
    titleContains: '',
    requestedDateFrom: '',
    page: 0,
    size: 12,
  };

  constructor(private nasaApodService: NasaApodService) { }

  ngOnInit() {
    this.loadQueries();
  }

  loadQueries() {
    this.loading = true;
    this.nasaApodService.searchQueries(this.filters).subscribe({
      next: (response) => {
        this.pagination = response;
        this.queries = response.content || [];
        this.totalImages = response.totalElements || 0;
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading queries:', error);
        this.queries = [];
        this.totalImages = 0;
        this.loading = false;
      },
    });
  }

  calculateStats() {
    if (!this.queries || !Array.isArray(this.queries)) {
      this.queries = [];
      this.videoCount = 0;
      this.thisMonthCount = 0;
      this.successRate = 0;
      return;
    }

    this.videoCount = this.queries.filter(
      (q) => q.mediaType === 'video'
    ).length;
    const currentMonth = new Date().getMonth();
    this.thisMonthCount = this.queries.filter(
      (q) => new Date(q.requestedDate).getMonth() === currentMonth
    ).length;
    const successCount = this.queries.filter(
      (q) => q.status === 'SUCCESS'
    ).length;
    this.successRate =
      this.queries.length > 0
        ? Math.round((successCount / this.queries.length) * 100)
        : 0;
  }

  applyFilters() {
    this.filters.page = 0;
    this.loadQueries();
  }

  clearFilters() {
    this.filters = {
      mediaType: '',
      status: '',
      titleContains: '',
      requestedDateFrom: '',
      page: 0,
      size: 12,
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

  getTodayApod() {
    this.loading = true;
    this.nasaApodService.getTodayApod().subscribe({
      next: () => {
        this.loadQueries();
      },
      error: (error) => {
        console.error("Error fetching today's APOD:", error);
        this.loading = false;
      },
    });
  }

  openCreateModal() {
    this.editingQuery = null;
    this.formData = { requestedDate: new Date().toISOString().split('T')[0] };
    this.showCreateModal = true;
  }

  editQuery(query: NasaApodQuery) {
    this.editingQuery = query;
    this.formData = {
      requestedDate: query.requestedDate,
      title: query.title,
      explanation: query.explanation,
      imageUrl: query.imageUrl,
      hdImageUrl: query.hdImageUrl,
      mediaType: query.mediaType,
      copyright: query.copyright,
      status: query.status,
    };
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.editingQuery = null;
    this.formData = { requestedDate: '' };
  }

  saveQuery() {
    this.saving = true;

    const operation = this.editingQuery
      ? this.nasaApodService.updateQuery(this.editingQuery.id, this.formData)
      : this.nasaApodService.createQuery(this.formData);

    operation.subscribe({
      next: () => {
        this.saving = false;
        this.closeCreateModal();
        this.loadQueries();
      },
      error: (error) => {
        console.error('Error saving query:', error);
        this.saving = false;
      },
    });
  }

  deleteQuery(query: NasaApodQuery) {
    if (confirm('¿Estás seguro de que quieres eliminar esta entrada APOD?')) {
      this.nasaApodService.deleteQuery(query.id).subscribe({
        next: () => {
          this.loadQueries();
        },
        error: (error) => {
          console.error('Error deleting query:', error);
        },
      });
    }
  }

  viewQuery(query: NasaApodQuery) {
    this.selectedQuery = query;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedQuery = null;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'SUCCESS':
        return 'bg-success/20 text-success';
      case 'ERROR':
        return 'bg-error/20 text-error';
      case 'PENDING':
        return 'bg-warning/20 text-warning';
      default:
        return 'bg-php-purple/20 text-php-purple';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
  }

  Math = Math;
}
