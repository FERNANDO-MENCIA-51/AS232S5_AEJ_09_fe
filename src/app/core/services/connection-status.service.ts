import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ConnectionStatus {
  isConnected: boolean;
  lastCheck: Date;
  status: 'Activo' | 'Inactivo';
  statusClass: string;
  dotClass: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConnectionStatusService {
  private readonly API_BASE_URL = `${environment.apiUrl}/${environment.apiVersion}/api`;
  private connectionStatusSubject = new BehaviorSubject<ConnectionStatus>({
    isConnected: false,
    lastCheck: new Date(),
    status: 'Inactivo',
    statusClass: 'text-error',
    dotClass: 'bg-error'
  });

  public connectionStatus$ = this.connectionStatusSubject.asObservable();
  private monitoringActive = false;

  constructor(private http: HttpClient) {
    // Servicio completamente desactivado para evitar interferencias
  }

  private initializeDelayedMonitoring() {
    // Monitoreo desactivado completamente
    return;
  }

  private startConnectionMonitoring() {
    // Monitoreo completamente desactivado
    return;
  }

  private checkConnectionAsync() {
    // Timeout más corto para verificaciones de fondo
    const timeoutMs = 3000; // 3 segundos timeout

    // Probar primero con un endpoint más ligero
    this.http.get(`${this.API_BASE_URL}/health`, {
      observe: 'response',
      responseType: 'text'
    })
      .pipe(
        timeout(timeoutMs),
        map(() => true),
        catchError(() => {
          // Si no hay endpoint de health, probar con AI Detection
          return this.http.get(`${this.API_BASE_URL}/ai-detection/queries?page=0&size=1`, {
            observe: 'response',
            responseType: 'json'
          })
            .pipe(
              timeout(timeoutMs),
              map(() => true),
              catchError(() => {
                // Como último recurso, probar NASA APOD
                return this.http.get(`${this.API_BASE_URL}/nasa-apod/queries?page=0&size=1`, {
                  observe: 'response',
                  responseType: 'json'
                })
                  .pipe(
                    timeout(timeoutMs),
                    map(() => true),
                    catchError(() => [false])
                  );
              })
            );
        })
      )
      .subscribe({
        next: (isConnected) => {
          this.updateConnectionStatus(isConnected);
        },
        error: () => {
          this.updateConnectionStatus(false);
        }
      });
  }

  private updateConnectionStatus(isConnected: boolean) {
    const status: ConnectionStatus = {
      isConnected,
      lastCheck: new Date(),
      status: isConnected ? 'Activo' : 'Inactivo',
      statusClass: isConnected ? 'text-success' : 'text-error',
      dotClass: isConnected ? 'bg-success' : 'bg-error'
    };

    this.connectionStatusSubject.next(status);
  }

  // Método para verificación manual (usado por botones del dashboard)
  public checkConnectionManually(): Observable<boolean> {
    const timeoutMs = 5000; // 5 segundos para verificaciones manuales

    return this.http.get(`${this.API_BASE_URL}/ai-detection/queries?page=0&size=1`, {
      observe: 'response',
      responseType: 'json'
    })
      .pipe(
        timeout(timeoutMs),
        map(() => {
          this.updateConnectionStatus(true);
          return true;
        }),
        catchError(() => {
          // Probar con NASA APOD si AI Detection falla
          return this.http.get(`${this.API_BASE_URL}/nasa-apod/queries?page=0&size=1`, {
            observe: 'response',
            responseType: 'json'
          })
            .pipe(
              timeout(timeoutMs),
              map(() => {
                this.updateConnectionStatus(true);
                return true;
              }),
              catchError(() => {
                this.updateConnectionStatus(false);
                return [false];
              })
            );
        })
      );
  }

  public getCurrentStatus(): ConnectionStatus {
    return this.connectionStatusSubject.value;
  }

  // Método para forzar una verificación inmediata (sin bloquear)
  public forceCheck() {
    setTimeout(() => {
      this.checkConnectionAsync();
    }, 100);
  }

  // Método para pausar/reanudar monitoreo
  public pauseMonitoring() {
    this.monitoringActive = false;
  }

  public resumeMonitoring() {
    if (!this.monitoringActive) {
      this.startConnectionMonitoring();
    }
  }
}