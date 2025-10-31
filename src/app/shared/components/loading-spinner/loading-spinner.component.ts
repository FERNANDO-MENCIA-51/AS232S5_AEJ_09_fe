import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="loading-spinner" 
      [class.overlay]="overlay"
      role="status"
      aria-live="polite"
      [attr.aria-label]="message || 'Cargando contenido'">
      <div class="spinner-container">
        <div class="relative" aria-hidden="true">
          <div class="w-12 h-12 border-4 border-php-purple/20 border-t-php-purple rounded-full animate-spin"></div>
          <div class="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-php-light-purple rounded-full animate-spin" style="animation-delay: 0.15s;"></div>
        </div>
        <p *ngIf="message" class="mt-4 text-text-muted text-sm">{{ message }}</p>
        <span class="sr-only">{{ message || 'Cargando contenido, por favor espere' }}</span>
      </div>
    </div>
  `,
  styles: [`
    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .loading-spinner.overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 9999;
    }

    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message?: string;
  @Input() overlay: boolean = false;
}
