import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {
  private readonly API_BASE_URL = 'http://localhost:8080/v1/api';

  constructor(private http: HttpClient) {}

  /**
   * Verifica si el backend está disponible usando un endpoint ligero
   * @param timeoutMs - Timeout en milisegundos (default: 3000)
   * @returns Observable<boolean> - true si está conectado, false si no
   */
  public checkBackendHealth(timeoutMs: number = 3000): Observable<boolean> {
    // Intentar usar endpoint de health si existe
    return this.http.get(`${this.API_BASE_URL}/health`, {
      observe: 'response',
      responseType: 'text'
    })
      .pipe(
        timeout(timeoutMs),
        map(() => true),
        catchError(() => {
          // Si no hay endpoint de health, probar con un endpoint que sabemos que existe
          return this.checkWithFallbackEndpoints(timeoutMs);
        })
      );
  }

  /**
   * Usa endpoints conocidos como fallback para verificar conectividad
   */
  private checkWithFallbackEndpoints(timeoutMs: number): Observable<boolean> {
    // Probar con AI Detection (endpoint más ligero)
    return this.http.head(`${this.API_BASE_URL}/ai-detection/queries`, {
      observe: 'response'
    })
      .pipe(
        timeout(timeoutMs),
        map(() => true),
        catchError(() => {
          // Como último recurso, probar NASA APOD
          return this.http.head(`${this.API_BASE_URL}/nasa-apod/queries`, {
            observe: 'response'
          })
            .pipe(
              timeout(timeoutMs),
              map(() => true),
              catchError(() => of(false))
            );
        })
      );
  }

  /**
   * Verificación rápida para la interfaz (solo 1 segundo de timeout)
   */
  public quickHealthCheck(): Observable<boolean> {
    return this.checkBackendHealth(1000);
  }

  /**
   * Verificación completa para verificaciones manuales
   */
  public fullHealthCheck(): Observable<boolean> {
    return this.checkBackendHealth(5000);
  }
}