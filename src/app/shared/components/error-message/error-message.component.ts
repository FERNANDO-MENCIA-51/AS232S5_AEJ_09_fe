import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="error" 
      class="error-message bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4"
      role="alert"
      aria-live="assertive">
      <div class="flex items-start gap-3">
        <i class="gg-danger text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true"></i>
        <div class="flex-1">
          <p class="text-red-400 text-sm" id="error-message">{{ error }}</p>
        </div>
        <button 
          *ngIf="retryable" 
          (click)="onRetry()"
          class="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md text-sm transition-colors flex-shrink-0"
          aria-label="Reintentar operación"
          type="button">
          Reintentar
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ErrorMessageComponent {
  @Input() error: string | null = null;
  @Input() retryable: boolean = false;
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
