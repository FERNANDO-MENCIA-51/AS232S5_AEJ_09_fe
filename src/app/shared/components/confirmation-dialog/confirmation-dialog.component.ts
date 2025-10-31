import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="isOpen" 
      class="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      [attr.aria-labelledby]="'dialog-title'"
      [attr.aria-describedby]="'dialog-description'">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        (click)="onCancel()"
        aria-hidden="true"></div>
      
      <!-- Dialog -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-bg-secondary rounded-xl shadow-2xl border border-php-purple/20 w-full max-w-md transform transition-all animate-slide-up">
          <!-- Header -->
          <div class="p-6 border-b border-php-purple/20">
            <h3 id="dialog-title" class="text-lg font-semibold text-text-primary">{{ title }}</h3>
          </div>
          
          <!-- Content -->
          <div class="p-6">
            <p id="dialog-description" class="text-text-muted">{{ message }}</p>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 p-6 border-t border-php-purple/20">
            <button 
              (click)="onCancel()"
              type="button"
              class="px-4 py-2 bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary rounded-lg transition-colors"
              aria-label="Cancelar acción">
              {{ cancelText }}
            </button>
            <button 
              (click)="onConfirm()"
              type="button"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              aria-label="Confirmar acción">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ConfirmationDialogComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '¿Estás seguro?';
  @Input() message: string = '';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent): void {
    if (this.isOpen) {
      event.preventDefault();
      this.onCancel();
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent): void {
    if (this.isOpen && (event.target as HTMLElement).tagName !== 'BUTTON') {
      event.preventDefault();
      this.onConfirm();
    }
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
