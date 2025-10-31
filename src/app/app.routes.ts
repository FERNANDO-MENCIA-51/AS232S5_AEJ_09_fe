import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'ai-detection',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/ai-detection/ai-detection.component').then(
                (m) => m.AiDetectionComponent
              ),
          },
          {
            path: 'history',
            loadComponent: () =>
              import('./pages/ai-detection/ai-detection-history/ai-detection-history.component').then(
                (m) => m.AiDetectionHistoryComponent
              ),
          },
        ],
      },
      {
        path: 'nasa-apod',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/nasa-apod/nasa-apod.component').then(
                (m) => m.NasaApodComponent
              ),
          },
          {
            path: 'history',
            loadComponent: () =>
              import('./pages/nasa-apod/nasa-apod-history/nasa-apod-history.component').then(
                (m) => m.NasaApodHistoryComponent
              ),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
