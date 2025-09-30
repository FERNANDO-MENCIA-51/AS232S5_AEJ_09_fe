import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AiDetectionService } from '../../core/services/ai-detection.service';
import { NasaApodService } from '../../core/services/nasa-apod.service';
import { NavigationActivity, NavigationTrackerService } from '../../core/services/navigation-tracker.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
      <div class="container mx-auto px-6 py-8 space-y-8 animate-fade-in">
        <!-- Educational Header Section -->
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-php-purple/10 via-card-blue/5 to-card-cyan/10 rounded-3xl"></div>
          <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-php-purple/5 to-transparent rounded-full blur-3xl"></div>
          <div class="relative glass-effect-enhanced rounded-3xl p-8 border border-php-purple/20">
            <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-php-purple to-php-dark-purple rounded-xl flex items-center justify-center shadow-lg">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                  <div>
                    <h1 class="text-4xl lg:text-5xl font-bold text-text-primary heading-primary mb-2 bg-gradient-to-r from-text-primary to-php-light-purple bg-clip-text text-transparent">
                      Centro de Análisis Inteligente
                    </h1>
                    <p class="text-text-secondary text-lg lg:text-xl text-professional font-medium">
                      Plataforma de Inteligencia Artificial y Exploración Espacial
                    </p>
                  </div>
                </div>
                
                <div class="flex flex-wrap items-center gap-6 mt-6">
                  <div class="flex items-center space-x-2 bg-success/10 px-4 py-2 rounded-full border border-success/20">
                    <div class="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span class="text-success text-sm font-medium">Sistema Operativo</span>
                  </div>
                  <div class="flex items-center space-x-2 bg-card-blue/10 px-4 py-2 rounded-full border border-card-blue/20">
                    <svg class="w-4 h-4 text-card-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="text-card-blue text-sm font-medium">Última actualización: {{ lastUpdated.toLocaleTimeString('es-ES') }}</span>
                  </div>
                  <div class="flex items-center space-x-2 bg-card-purple/10 px-4 py-2 rounded-full border border-card-purple/20">
                    <svg class="w-4 h-4 text-card-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span class="text-card-purple text-sm font-medium">IA Avanzada</span>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  (click)="loadDashboardData()"
                  class="px-6 py-3 professional-card text-text-primary rounded-xl hover-lift group transition-all duration-300"
                  [disabled]="loading"
                >
                  <div class="flex items-center justify-center">
                    <svg class="w-5 h-5 mr-3 group-hover:text-php-purple transition-colors" [class.animate-spin]="loading" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <span class="font-medium">{{ loading ? 'Sincronizando...' : 'Actualizar Datos' }}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Analytics Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            *ngFor="let stat of stats; let i = index"
            class="relative group cursor-pointer"
            (click)="onStatClick(i)"
          >
            <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl" [class]="getCardGlowClass(i)"></div>
            <div class="relative stats-card p-6 hover-lift group-hover:scale-105 transition-all duration-300" [class]="getCardClass(i)">
              <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center group-hover:bg-white/25 transition-colors duration-300 group-hover:scale-110">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="stat.icon"></path>
                  </svg>
                </div>
                <div class="text-right">
                  <div class="flex items-center space-x-1 text-white/80 text-xs">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path *ngIf="stat.trend === 'up'" fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    <span>{{ stat.change }}</span>
                  </div>
                </div>
              </div>
              
              <div class="space-y-2">
                <h3 class="text-white/90 text-sm font-semibold heading-secondary uppercase tracking-wider">{{ stat.label }}</h3>
                <p class="text-3xl font-bold text-white heading-primary">{{ stat.value }}</p>
                <div class="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div class="bg-white/60 h-full rounded-full transition-all duration-1000" [style.width]="getProgressWidth(i)"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Educational Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- AI Detection Module -->
          <div class="relative group">
            <div class="absolute inset-0 bg-gradient-to-br from-card-green/20 to-card-green-dark/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative glass-effect-enhanced rounded-2xl p-8 border border-card-green/20 hover-lift group-hover:border-card-green/40 transition-all duration-300">
              <div class="flex items-start justify-between mb-6">
                <div class="flex items-center space-x-4">
                  <div class="w-14 h-14 bg-gradient-to-br from-card-green to-card-green-dark rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-text-primary heading-secondary mb-1">Detección de IA</h3>
                    <p class="text-text-secondary text-sm font-medium">Análisis Inteligente de Contenido</p>
                  </div>
                </div>
                <div class="bg-card-green/10 px-3 py-1 rounded-full">
                  <span class="text-card-green text-xs font-semibold">ACTIVO</span>
                </div>
              </div>
              
              <p class="text-text-muted mb-6 text-professional leading-relaxed">
                Utiliza algoritmos avanzados de aprendizaje automático para identificar y analizar contenido generado por inteligencia artificial con alta precisión.
              </p>
              
              <div class="flex items-center justify-between mb-6">
                <div class="flex space-x-4">
                  <div class="text-center">
                    <p class="text-2xl font-bold text-card-green">{{ stats[0].value }}</p>
                    <p class="text-xs text-text-muted">Análisis</p>
                  </div>
                  <div class="text-center">
                    <p class="text-2xl font-bold text-card-green">98%</p>
                    <p class="text-xs text-text-muted">Precisión</p>
                  </div>
                </div>
              </div>
              
              <button
                (click)="navigateToAiDetection()"
                class="w-full py-4 bg-gradient-to-r from-card-green to-card-green-dark text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-card-green/25 transition-all duration-300 group-hover:scale-105"
              >
                <div class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Iniciar Análisis de IA
                </div>
              </button>
            </div>
          </div>

          <!-- NASA APOD Module -->
          <div class="relative group">
            <div class="absolute inset-0 bg-gradient-to-br from-card-orange/20 to-card-orange-dark/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative glass-effect-enhanced rounded-2xl p-8 border border-card-orange/20 hover-lift group-hover:border-card-orange/40 transition-all duration-300">
              <div class="flex items-start justify-between mb-6">
                <div class="flex items-center space-x-4">
                  <div class="w-14 h-14 bg-gradient-to-br from-card-orange to-card-orange-dark rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-text-primary heading-secondary mb-1">NASA APOD</h3>
                    <p class="text-text-secondary text-sm font-medium">Exploración Espacial Diaria</p>
                  </div>
                </div>
                <div class="bg-card-orange/10 px-3 py-1 rounded-full">
                  <span class="text-card-orange text-xs font-semibold">ACTIVO</span>
                </div>
              </div>
              
              <p class="text-text-muted mb-6 text-professional leading-relaxed">
                Descubre el universo a través de las impresionantes imágenes astronómicas seleccionadas diariamente por la NASA con explicaciones científicas detalladas.
              </p>
              
              <div class="flex items-center justify-between mb-6">
                <div class="flex space-x-4">
                  <div class="text-center">
                    <p class="text-2xl font-bold text-card-orange">{{ stats[1].value }}</p>
                    <p class="text-xs text-text-muted">Imágenes</p>
                  </div>
                  <div class="text-center">
                    <p class="text-2xl font-bold text-card-orange">100%</p>
                    <p class="text-xs text-text-muted">NASA</p>
                  </div>
                </div>
              </div>
              
              <button
                (click)="navigateToNasaApod()"
                class="w-full py-4 bg-gradient-to-r from-card-orange to-card-orange-dark text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-card-orange/25 transition-all duration-300 group-hover:scale-105"
              >
                <div class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  Explorar el Cosmos
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Enhanced Activity Feed -->
        <div class="glass-effect-enhanced rounded-2xl p-8 border border-php-purple/20">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-php-purple to-php-dark-purple rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-text-primary heading-secondary">Registro de Actividades</h3>
            </div>
            <div class="bg-php-purple/10 px-4 py-2 rounded-full">
              <span class="text-php-purple text-sm font-medium">{{ recentActivity.length }} eventos</span>
            </div>
          </div>
          
          <div class="space-y-4">
            <div
              *ngFor="let activity of recentActivity; let i = index"
              class="activity-item p-4 hover-lift group cursor-pointer"
              (click)="navigateToActivity(activity)"
            >
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200" [class]="getActivityIconClass(i)">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="activity.icon"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-text-primary font-medium text-professional">{{ activity.action }}</p>
                  <p class="text-text-muted text-sm">{{ activity.time }}</p>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-sm px-3 py-1 rounded-full font-medium" [class]="getStatusClass(activity.status)">
                    {{ activity.status }}
                  </span>
                  <svg class="w-4 h-4 text-text-muted group-hover:text-php-purple transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>
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
export class DashboardComponent implements OnInit, OnDestroy {
  loading = false;
  lastUpdated = new Date();
  private activitiesSubscription: Subscription = new Subscription();
  
  stats = [
    {
      label: 'Consultas IA',
      value: '0',
      change: '0%',
      trend: 'up',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      label: 'Imágenes NASA',
      value: '0',
      change: '0%',
      trend: 'up',
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    {
      label: 'Total Solicitudes',
      value: '0',
      change: '0%',
      trend: 'up',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
    {
      label: 'Estado API',
      value: 'Verificando...',
      change: '0%',
      trend: 'up',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  ];

  recentActivity: NavigationActivity[] = [];

  constructor(
    private router: Router,
    private aiDetectionService: AiDetectionService,
    private nasaApodService: NasaApodService,
    private toastService: ToastService,
    private navigationTracker: NavigationTrackerService
  ) {}

  ngOnInit() {
    console.log('Dashboard iniciado correctamente');
    this.loadDashboardData();
    
    // Suscribirse a las actividades de navegación
    this.activitiesSubscription = this.navigationTracker.activities$.subscribe(
      activities => {
        this.recentActivity = activities;
      }
    );
  }

  ngOnDestroy() {
    this.activitiesSubscription.unsubscribe();
  }

  loadDashboardData() {
    console.log('Cargando datos del dashboard...');
    this.loading = true;
    this.lastUpdated = new Date();
    
    // Inicializar estado de API
    this.stats[3].value = 'Verificando...';
    this.stats[3].trend = 'up';
    
    let completedRequests = 0;
    const totalRequests = 2;
    let hasBackendConnection = false;

    const checkComplete = () => {
      completedRequests++;
      if (completedRequests >= totalRequests) {
        this.loading = false;
        // Actualizar estado de API basado en si hubo conexión exitosa
        this.stats[3].value = hasBackendConnection ? 'En Línea' : 'Desconectado';
        this.stats[3].trend = hasBackendConnection ? 'up' : 'down';
        console.log('Carga de dashboard completada');
      }
    };

    // Cargar datos de AI Detection (opcional)
    this.aiDetectionService.getQueries(0, 1).subscribe({
      next: (response) => {
        console.log('AI Detection response:', response);
        this.stats[0].value = response.totalElements.toString();
        this.stats[0].change = '+12%';
        this.updateTotalRequests();
        hasBackendConnection = true;
        this.navigationTracker.addCustomActivity('Datos de AI Detection cargados: ' + response.totalElements + ' consultas', 'Éxito');
        checkComplete();
      },
      error: (error) => {
        console.log('AI Detection no disponible:', error);
        this.stats[0].value = 'N/A';
        this.stats[0].change = '0%';
        this.navigationTracker.addCustomActivity('AI Detection no disponible - continuando', 'Advertencia');
        checkComplete();
      }
    });

    // Cargar datos de NASA APOD (opcional)
    this.nasaApodService.getQueries(0, 1).subscribe({
      next: (response) => {
        console.log('NASA APOD response:', response);
        this.stats[1].value = response.totalElements.toString();
        this.stats[1].change = '+8%';
        this.updateTotalRequests();
        hasBackendConnection = true;
        this.navigationTracker.addCustomActivity('Datos de NASA APOD cargados: ' + response.totalElements + ' imágenes', 'Éxito');
        checkComplete();
      },
      error: (error) => {
        console.log('NASA APOD no disponible:', error);
        this.stats[1].value = 'N/A';
        this.stats[1].change = '0%';
        this.navigationTracker.addCustomActivity('NASA APOD no disponible - continuando', 'Advertencia');
        checkComplete();
      }
    });
  }

  private updateTotalRequests() {
    const aiTotal = this.stats[0].value !== 'N/A' ? parseInt(this.stats[0].value) || 0 : 0;
    const nasaTotal = this.stats[1].value !== 'N/A' ? parseInt(this.stats[1].value) || 0 : 0;
    this.stats[2].value = (aiTotal + nasaTotal).toString();
    this.stats[2].change = aiTotal + nasaTotal > 0 ? '+10%' : '0%';
  }

  navigateToAiDetection() {
    this.router.navigate(['/ai-detection']);
  }

  navigateToNasaApod() {
    this.router.navigate(['/nasa-apod']);
  }

  navigateToActivity(activity: NavigationActivity) {
    if (activity.route) {
      this.router.navigate([activity.route]);
    } else {
      // Determinar ruta basada en la acción
      if (activity.action.includes('AI Detection') || activity.action.includes('Detección')) {
        this.router.navigate(['/ai-detection']);
      } else if (activity.action.includes('NASA') || activity.action.includes('APOD')) {
        this.router.navigate(['/nasa-apod']);
      }
    }
  }

  refreshData() {
    this.loadDashboardData();
    this.toastService.info('Actualizando datos del dashboard...');
  }

  getCardClass(index: number): string {
    const colors = ['card-green', 'card-orange', 'card-blue', 'card-purple'];
    return colors[index % colors.length];
  }

  getActivityIconClass(index: number): string {
    const colors = ['card-green', 'card-orange', 'card-blue'];
    return colors[index % colors.length];
  }

  onStatClick(index: number) {
    switch (index) {
      case 0:
        this.navigateToAiDetection();
        break;
      case 1:
        this.navigateToNasaApod();
        break;
      case 2:
        this.loadDashboardData();
        break;
      case 3:
        // Verificar estado de API manualmente
        this.loadDashboardData();
        break;
    }
  }

  getCardGlowClass(index: number): string {
    const colors = ['from-card-green/30 to-card-green-dark/30', 'from-card-orange/30 to-card-orange-dark/30', 'from-card-blue/30 to-card-blue-dark/30', 'from-card-purple/30 to-card-purple-dark/30'];
    return colors[index % colors.length];
  }

  getProgressWidth(index: number): string {
    const widths = ['75%', '60%', '85%', '90%'];
    return widths[index % widths.length];
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'éxito':
        return 'bg-success/20 text-success border border-success/30';
      case 'advertencia':
        return 'bg-warning/20 text-warning border border-warning/30';
      case 'error':
        return 'bg-error/20 text-error border border-error/30';
      default:
        return 'bg-php-purple/20 text-php-purple border border-php-purple/30';
    }
  }
}