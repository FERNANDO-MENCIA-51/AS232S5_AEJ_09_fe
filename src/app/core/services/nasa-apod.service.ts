import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse, SearchFilters } from '../models/common.model';
import {
  CreateNasaApodQuery,
  NasaApodHistoryItem,
  NasaApodQuery,
  NasaApodResponse,
  NasaHistoryFilters
} from '../models/nasa-apod.model';
import { ApiService } from './api.service';

/**
 * Service for NASA APOD (Astronomy Picture of the Day) operations
 * Handles fetching and managing astronomical images from NASA
 */
@Injectable({
  providedIn: 'root'
})
export class NasaApodService {
  private readonly endpoint = '/v1/api/nasa-apod';

  constructor(private apiService: ApiService) { }

  // CRUD Operations

  /**
   * Create a new NASA APOD query
   * @param data - The query data to create
   * @returns Observable of the created query
   */
  createQuery(data: CreateNasaApodQuery): Observable<NasaApodQuery> {
    return this.apiService.post<NasaApodQuery>(`${this.endpoint}/queries`, data);
  }

  /**
   * Get paginated list of NASA APOD queries
   * @param page - Page number (default: 0)
   * @param size - Page size (default: 20)
   * @returns Observable of paginated queries
   */
  getQueries(page = 0, size = 20): Observable<PaginatedResponse<NasaApodQuery>> {
    return this.apiService.get<PaginatedResponse<NasaApodQuery>>(
      `${this.endpoint}/queries`,
      { page, size }
    );
  }

  /**
   * Get a specific NASA APOD query by ID
   * @param id - The query ID
   * @returns Observable of the query
   */
  getQueryById(id: number): Observable<NasaApodQuery> {
    return this.apiService.get<NasaApodQuery>(`${this.endpoint}/queries/${id}`);
  }

  /**
   * Update an existing NASA APOD query
   * @param id - The query ID to update
   * @param data - The updated query data
   * @returns Observable of the updated query
   */
  updateQuery(id: number, data: Partial<CreateNasaApodQuery>): Observable<NasaApodQuery> {
    return this.apiService.put<NasaApodQuery>(`${this.endpoint}/queries/${id}`, data);
  }

  /**
   * Delete a NASA APOD query
   * @param id - The query ID to delete
   * @returns Observable of void
   */
  deleteQuery(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/queries/${id}`);
  }

  // Search

  /**
   * Search NASA APOD queries with filters
   * @param filters - Search filters to apply
   * @returns Observable of paginated filtered queries
   */
  searchQueries(filters: SearchFilters): Observable<PaginatedResponse<NasaApodQuery>> {
    return this.apiService.get<PaginatedResponse<NasaApodQuery>>(
      `${this.endpoint}/queries`,
      filters
    );
  }

  // NASA API Integration

  /**
   * Get today's Astronomy Picture of the Day
   * @returns Observable of today's APOD response
   */
  getTodayApod(): Observable<NasaApodResponse> {
    return this.apiService.get<NasaApodResponse>(`${this.endpoint}/today`);
  }

  /**
   * Get APOD for a specific date
   * @param date - Date in YYYY-MM-DD format
   * @returns Observable of APOD response for the specified date
   */
  getApodByDate(date: string): Observable<NasaApodResponse> {
    return this.apiService.get<NasaApodResponse>(`${this.endpoint}/date`, { date });
  }

  /**
   * Get APOD with optional date parameter (POST method)
   * @param date - Optional date in YYYY-MM-DD format
   * @returns Observable of APOD response
   */
  getApod(date?: string): Observable<NasaApodResponse> {
    return this.apiService.post<NasaApodResponse>(`${this.endpoint}/get`, { date });
  }

  // Health & Test

  /**
   * Check the health status of the NASA APOD service
   * @returns Observable of health check response
   */
  healthCheck(): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/health`);
  }

  // ===== NUEVOS MÉTODOS PARA HISTORIAL =====

  /**
   * Obtener historial con filtros opcionales
   * GET /v1/api/nasa-apod/history?mediaType={type}&status={status}&limit={limit}
   */
  getHistory(filters?: NasaHistoryFilters): Observable<NasaApodHistoryItem[]> {
    const params: any = {};
    if (filters?.mediaType) params.mediaType = filters.mediaType;
    if (filters?.status) params.status = filters.status;
    if (filters?.limit) params.limit = filters.limit.toString();
    return this.apiService.get<NasaApodHistoryItem[]>(`${this.endpoint}/history`, params);
  }

  /**
   * Obtener consulta específica por ID
   * GET /v1/api/nasa-apod/history/{id}
   */
  getHistoryById(id: number): Observable<NasaApodHistoryItem> {
    return this.apiService.get<NasaApodHistoryItem>(`${this.endpoint}/history/${id}`);
  }

  /**
   * Buscar por título
   * GET /v1/api/nasa-apod/history/search?title={title}
   */
  searchByTitle(title: string): Observable<NasaApodHistoryItem[]> {
    return this.apiService.get<NasaApodHistoryItem[]>(`${this.endpoint}/history/search`, { title });
  }

  /**
   * Buscar por fecha
   * GET /v1/api/nasa-apod/history/by-date/{date}
   */
  getHistoryByDate(date: string): Observable<NasaApodHistoryItem[]> {
    return this.apiService.get<NasaApodHistoryItem[]>(`${this.endpoint}/history/by-date/${date}`);
  }

  /**
   * Eliminar consulta por ID
   * DELETE /v1/api/nasa-apod/history/{id}
   */
  deleteHistoryItem(id: number): Observable<string> {
    return this.apiService.delete<string>(`${this.endpoint}/history/${id}`);
  }

  /**
   * Eliminar todo el historial
   * DELETE /v1/api/nasa-apod/history
   */
  deleteAllHistory(): Observable<string> {
    return this.apiService.delete<string>(`${this.endpoint}/history`);
  }

  /**
   * Contar total de consultas
   * GET /v1/api/nasa-apod/history/count
   */
  getHistoryCount(): Observable<number> {
    return this.apiService.get<number>(`${this.endpoint}/history/count`);
  }

  /**
   * Test NASA API connection
   * GET /v1/api/nasa-apod/test-nasa-api
   */
  testNasaAPI(): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/test-nasa-api`);
  }

  /**
   * Test NASA database connection
   * GET /v1/api/nasa-apod/test-nasa-database
   */
  testNasaDatabase(): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/test-nasa-database`);
  }
}