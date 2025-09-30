import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  description: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],

  template: `
    <aside
      class="fixed left-0 top-0 h-full w-72 glass-effect-enhanced border-r border-php-purple/20 z-50 overflow-hidden"
    >
      <!-- Educational Header -->
      <div class="relative p-6 border-b border-php-purple/20">
        <div
          class="absolute inset-0 bg-gradient-to-br from-php-purple/10 to-card-blue/5"
        ></div>
        <div class="relative flex items-center space-x-3">
          <div
            class="w-12 h-12 bg-gradient-to-br from-php-purple to-php-dark-purple rounded-xl flex items-center justify-center shadow-lg"
          >
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              ></path>
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-text-primary heading-secondary">
              APIs IA
            </h1>
            <p class="text-text-muted text-sm text-professional">
              Plataforma de Análisis
            </p>
          </div>
        </div>
      </div>

      <!-- Enhanced Navigation -->
      <nav class="p-4 space-y-2">
        <div class="mb-6">
          <h3
            class="text-text-muted text-xs font-semibold uppercase tracking-wider mb-3 px-3"
          >
            Módulos Principales
          </h3>
          <ul class="space-y-1">
            <li *ngFor="let item of menuItems; let i = index">
              <a
                [routerLink]="item.route"
                routerLinkActive="bg-gradient-to-r from-php-purple/20 to-php-purple/10 text-php-purple border-r-2 border-php-purple shadow-lg"
                class="flex items-center space-x-4 px-4 py-4 rounded-xl text-text-secondary hover:bg-gradient-to-r hover:from-php-purple/10 hover:to-transparent hover:text-text-primary transition-all duration-300 hover-lift group relative overflow-hidden"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-php-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
                <div
                  class="relative w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  [class]="getIconBgClass(i)"
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
                      [attr.d]="item.icon"
                    ></path>
                  </svg>
                </div>
                <div class="relative flex-1">
                  <span class="font-semibold text-professional">{{
                    item.label
                  }}</span>
                  <p class="text-xs text-text-muted mt-0.5">
                    {{ item.description }}
                  </p>
                </div>
                <svg
                  class="w-4 h-4 text-text-muted group-hover:text-php-purple group-hover:translate-x-1 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      label: 'Panel de Control',
      route: '/dashboard',
      description: 'Centro de análisis y métricas',
    },
    {
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      label: 'Detección de IA',
      route: '/ai-detection',
      description: 'Análisis inteligente de contenido',
    },
    {
      icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
      label: 'NASA APOD',
      route: '/nasa-apod',
      description: 'Exploración espacial diaria',
    },
  ];

  getIconBgClass(index: number): string {
    const colors = [
      'bg-gradient-to-br from-card-green to-card-green-dark',
      'bg-gradient-to-br from-card-blue to-card-blue-dark',
      'bg-gradient-to-br from-card-orange to-card-orange-dark',
    ];
    return colors[index % colors.length];
  }
}
