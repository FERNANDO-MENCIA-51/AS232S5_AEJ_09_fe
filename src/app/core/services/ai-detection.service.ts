import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AiDetectionHistoryItem,
  AiDetectionQuery,
  AiDetectionResponse,
  CreateAiDetectionQuery,
  UpdateAiDetectionQuery
} from '../models/ai-detection.model';
import { PaginatedResponse, SearchFilters } from '../models/common.model';
import { ApiService } from './api.service';

/**
 * Service for AI Detection operations
 * Handles text analysis to detect AI-generated content
 */
@Injectable({
  providedIn: 'root'
})
export class AiDetectionService {
  private readonly endpoint = '/v1/api/ai-detection';

  constructor(private apiService: ApiService) { }

  // CRUD Operations

  /**
   * Create a new AI detection query
   * @param data - The query data to create
   * @returns Observable of the created query
   */
  createQuery(data: CreateAiDetectionQuery): Observable<AiDetectionQuery> {
    return this.apiService.post<AiDetectionQuery>(`${this.endpoint}/queries`, data);
  }

  /**
   * Get paginated list of AI detection queries
   * @param page - Page number (default: 0)
   * @param size - Page size (default: 20)
   * @returns Observable of paginated queries
   */
  getQueries(page = 0, size = 20): Observable<PaginatedResponse<AiDetectionQuery>> {
    return this.apiService.get<PaginatedResponse<AiDetectionQuery>>(
      `${this.endpoint}/queries`,
      { page, size }
    );
  }

  /**
   * Get a specific AI detection query by ID
   * @param id - The query ID
   * @returns Observable of the query
   */
  getQueryById(id: number): Observable<AiDetectionQuery> {
    return this.apiService.get<AiDetectionQuery>(`${this.endpoint}/queries/${id}`);
  }

  /**
   * Update an existing AI detection query
   * @param id - The query ID to update
   * @param data - The updated query data
   * @returns Observable of the updated query
   */
  updateQuery(id: number, data: UpdateAiDetectionQuery): Observable<AiDetectionQuery> {
    return this.apiService.put<AiDetectionQuery>(`${this.endpoint}/queries/${id}`, data);
  }

  /**
   * Delete an AI detection query
   * @param id - The query ID to delete
   * @returns Observable of void
   */
  deleteQuery(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/queries/${id}`);
  }

  // Search

  /**
   * Search AI detection queries with filters
   * @param filters - Search filters to apply
   * @returns Observable of paginated filtered queries
   */
  searchQueries(filters: SearchFilters): Observable<PaginatedResponse<AiDetectionQuery>> {
    return this.apiService.get<PaginatedResponse<AiDetectionQuery>>(
      `${this.endpoint}/queries/search`,
      filters
    );
  }

  // Real-time Detection

  /**
   * Detect AI-generated content in text (POST method)
   * @param text - The text to analyze
   * @param lang - Optional language code (e.g., 'en', 'es')
   * @returns Observable of detection response with classification and probability
   */
  detectAI(text: string, lang?: string): Observable<AiDetectionResponse> {
    return this.apiService.post<AiDetectionResponse>(`${this.endpoint}/detect`, { text, lang });
  }

  /**
   * Detect AI-generated content in text (GET method)
   * @param text - The text to analyze
   * @param lang - Optional language code (e.g., 'en', 'es')
   * @returns Observable of detection response with classification and probability
   */
  detectAISimple(text: string, lang?: string): Observable<AiDetectionResponse> {
    return this.apiService.get<AiDetectionResponse>(`${this.endpoint}/detect-simple`, { text, lang });
  }

  // Health & Test

  /**
   * Check the health status of the AI Detection service
   * @returns Observable of health check response
   */
  healthCheck(): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/health`);
  }

  // ===== NUEVOS MÉTODOS PARA HISTORIAL =====

  /**
   * Obtener historial de consultas con filtro opcional por idioma
   * GET /v1/api/ai-detection/history?lang={lang}
   */
  getHistory(lang?: string): Observable<AiDetectionHistoryItem[]> {
    const params = lang ? { lang } : {};
    return this.apiService.get<AiDetectionHistoryItem[]>(`${this.endpoint}/history`, params);
  }

  /**
   * Obtener consulta específica por ID
   * GET /v1/api/ai-detection/history/{id}
   */
  getHistoryById(id: number): Observable<AiDetectionHistoryItem> {
    return this.apiService.get<AiDetectionHistoryItem>(`${this.endpoint}/history/${id}`);
  }

  /**
   * Eliminar consulta por ID
   * DELETE /v1/api/ai-detection/history/{id}
   */
  deleteHistoryItem(id: number): Observable<string> {
    return this.apiService.delete<string>(`${this.endpoint}/history/${id}`);
  }

  /**
   * Eliminar todo el historial
   * DELETE /v1/api/ai-detection/history
   */
  deleteAllHistory(): Observable<string> {
    return this.apiService.delete<string>(`${this.endpoint}/history`);
  }

  /**
   * Contar total de consultas
   * GET /v1/api/ai-detection/history/count
   */
  getHistoryCount(): Observable<number> {
    return this.apiService.get<number>(`${this.endpoint}/history/count`);
  }

  /**
   * Test database connection
   * GET /v1/api/ai-detection/test-database
   */
  testDatabase(): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/test-database`);
  }

  /**
   * Test RapidAPI connection
   * GET /v1/api/ai-detection/test-rapidapi
   */
  testRapidAPI(): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/test-rapidapi`);
  }
}