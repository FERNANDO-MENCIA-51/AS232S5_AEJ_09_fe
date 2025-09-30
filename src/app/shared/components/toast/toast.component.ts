import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div
        *ngFor="let toast of toasts"
        class="flex items-center p-4 rounded-lg shadow-lg border animate-slide-up max-w-sm"
        [class]="getToastClass(toast.type)"
      >
        <i [class]="getToastIcon(toast.type)" class="text-lg mr-3"></i>
        <span class="flex-1 text-sm">{{ toast.message }}</span>
        <button
          (click)="removeToast(toast.id)"
          class="ml-2 text-current opacity-70 hover:opacity-100 transition-opacity"
        >
          <i class="gg-close text-sm"></i>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ToastComponent {
  @Input() toasts: Toast[] = [];
  @Output() remove = new EventEmitter<string>();

  removeToast(id: string) {
    this.remove.emit(id);
  }

  getToastClass(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-success/20 border-success/30 text-success';
      case 'error':
        return 'bg-error/20 border-error/30 text-error';
      case 'warning':
        return 'bg-warning/20 border-warning/30 text-warning';
      case 'info':
        return 'bg-php-purple/20 border-php-purple/30 text-php-purple';
      default:
        return 'bg-bg-secondary border-php-purple/20 text-text-primary';
    }
  }

  getToastIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'gg-check';
      case 'error':
        return 'gg-danger';
      case 'warning':
        return 'gg-info';
      case 'info':
        return 'gg-info';
      default:
        return 'gg-info';
    }
  }
}
