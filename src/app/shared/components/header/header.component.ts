import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],

  template: `
    <header
      class="fixed top-0 left-72 right-0 h-20 glass-effect-enhanced border-b border-php-purple/20 z-40"
    >
      <div class="flex items-center justify-between h-full px-8">
        <!-- Educational Title Section -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-gradient-to-br from-card-cyan to-card-cyan-dark rounded-lg flex items-center justify-center shadow-md"
            >
              <svg
                class="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-text-primary heading-secondary">
                Centro de Análisis Inteligente
              </h2>
              <p class="text-text-muted text-sm text-professional">
                Plataforma de Inteligencia Artificial y Exploración Espacial
              </p>
            </div>
          </div>
        </div>

        <!-- Status and Tools Section -->
        <div class="flex items-center space-x-6">
          <!-- Real-time Status -->
          <div class="flex items-center space-x-4">
            <div
              class="flex items-center space-x-2 bg-card-blue/10 px-3 py-2 rounded-full border border-card-blue/20"
            >
              <svg
                class="w-4 h-4 text-card-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span class="text-card-blue text-sm font-medium">{{
                getCurrentTime()
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class HeaderComponent {
  getCurrentTime(): string {
    return new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
