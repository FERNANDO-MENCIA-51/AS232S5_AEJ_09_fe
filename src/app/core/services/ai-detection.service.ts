import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  AiDetectionQuery, 
  CreateAiDetectionQuery, 
  UpdateAiDetectionQuery,
  AiDetectionResponse 
} from '../models/ai-detection.model';
import { PaginatedResponse, SearchFilters } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class AiDetectionService {
  private readonly endpoint = '/v1/api/ai-detection';

  constructor(private apiService: ApiService) {}

  // CRUD Operations
  createQuery(data: CreateAiDetectionQuery): Observable<AiDetectionQuery> {
    return this.apiService.post<AiDetectionQuery>(`${this.endpoint}/queries`, data);
  }

  getQueries(page = 0, size = 20): Observable<PaginatedResponse<AiDetectionQuery>> {
    return this.apiService.get<PaginatedResponse<AiDetectionQuery>>(
      `${this.endpoint}/queries`, 
      { page, size }
    );
  }

  getQueryById(id: number): Observable<AiDetectionQuery> {
    return this.apiService.get<AiDetectionQuery>(`${this.endpoint}/queries/${id}`);
  }

  updateQuery(id: number, data: UpdateAiDetectionQuery): Observable<AiDetectionQuery> {
    return this.apiService.put<AiDetectionQuery>(`${this.endpoint}/queries/${id}`, data);
  }

  deleteQuery(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/queries/${id}`);
  }

  // Search
  searchQueries(filters: SearchFilters): Observable<PaginatedResponse<AiDetectionQuery>> {
    return this.apiService.get<PaginatedResponse<AiDetectionQuery>>(
      `${this.endpoint}/queries/search`, 
      filters
    );
  }

  // Real-time Detection
  detectAI(text: string, lang?: string): Observable<AiDetectionResponse> {
    return this.apiService.post<AiDetectionResponse>(`${this.endpoint}/detect`, { text, lang });
  }

  detectAISimple(text: string, lang?: string): Observable<AiDetectionResponse> {
    return this.apiService.get<AiDetectionResponse>(`${this.endpoint}/detect-simple`, { text, lang });
  }

  // Health & Test
  healthCheck(): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/health`);
  }
}