import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" (click)="closeModal()"></div>
      
      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-bg-secondary rounded-xl shadow-2xl border border-php-purple/20 w-full max-w-md transform transition-all animate-slide-up">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-php-purple/20">
            <h3 class="text-lg font-semibold text-text-primary">{{ title }}</h3>
            <button 
              (click)="closeModal()"
              class="text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-bg-tertiary"
            >
              <i class="gg-close text-lg"></i>
            </button>
          </div>
          
          <!-- Content -->
          <div class="p-6">
            <ng-content></ng-content>
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
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}