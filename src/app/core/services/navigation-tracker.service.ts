import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface NavigationActivity {
  action: string;
  time: string;
  status: string;
  icon: string;
  route?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationTrackerService {
  private activitiesSubject = new BehaviorSubject<NavigationActivity[]>([
    {
      action: 'Dashboard iniciado',
      time: 'ahora mismo',
      status: 'Éxito',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  ]);

  public activities$ = this.activitiesSubject.asObservable();

  constructor(private router: Router) {
    this.trackNavigation();
  }

  private trackNavigation() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.addNavigationActivity(event.url);
      });
  }

  private addNavigationActivity(url: string) {
    let action = '';
    let icon = '';
    let status = 'Éxito';

    switch (url) {
      case '/dashboard':
        action = 'Navegó al Panel de Control';
        icon = 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6';
        break;
      case '/ai-detection':
        action = 'Accedió a Detección de IA';
        icon = 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z';
        break;
      case '/nasa-apod':
        action = 'Exploró NASA APOD';
        icon = 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z';
        break;
      default:
        return; // No agregar actividad para rutas desconocidas
    }

    if (action) {
      this.addActivity(action, status, icon, url);
    }
  }

  addActivity(action: string, status: string, icon: string, route?: string) {
    const currentActivities = this.activitiesSubject.value;
    const newActivity: NavigationActivity = {
      action,
      time: 'ahora mismo',
      status,
      icon,
      route
    };

    // Actualizar tiempos de actividades anteriores
    const updatedActivities = currentActivities.map((activity, index) => {
      if (index === 0) {
        return { ...activity, time: 'hace un momento' };
      } else if (index === 1) {
        return { ...activity, time: 'hace 2 minutos' };
      } else if (index === 2) {
        return { ...activity, time: 'hace 5 minutos' };
      }
      return activity;
    });

    // Agregar nueva actividad al inicio y mantener solo las últimas 4
    const newActivities = [newActivity, ...updatedActivities].slice(0, 4);
    this.activitiesSubject.next(newActivities);
  }

  addCustomActivity(action: string, status: 'Éxito' | 'Error' | 'Advertencia' = 'Éxito') {
    let icon = '';
    switch (status) {
      case 'Éxito':
        icon = 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
        break;
      case 'Error':
        icon = 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
        break;
      case 'Advertencia':
        icon = 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
        break;
    }
    this.addActivity(action, status, icon);
  }

  getCurrentActivities(): NavigationActivity[] {
    return this.activitiesSubject.value;
  }
}