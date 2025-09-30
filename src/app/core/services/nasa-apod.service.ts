import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { NasaApodQuery, CreateNasaApodQuery } from '../models/nasa-apod.model';
import { PaginatedResponse, SearchFilters } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class NasaApodService {
  private readonly endpoint = '/v1/api/nasa-apod';

  constructor(private apiService: ApiService) {}

  // CRUD Operations
  createQuery(data: CreateNasaApodQuery): Observable<NasaApodQuery> {
    return this.apiService.post<NasaApodQuery>(`${this.endpoint}/queries`, data);
  }

  getQueries(page = 0, size = 20): Observable<PaginatedResponse<NasaApodQuery>> {
    return this.apiService.get<PaginatedResponse<NasaApodQuery>>(
      `${this.endpoint}/queries`, 
      { page, size }
    );
  }

  getQueryById(id: number): Observable<NasaApodQuery> {
    return this.apiService.get<NasaApodQuery>(`${this.endpoint}/queries/${id}`);
  }

  updateQuery(id: number, data: Partial<CreateNasaApodQuery>): Observable<NasaApodQuery> {
    return this.apiService.put<NasaApodQuery>(`${this.endpoint}/queries/${id}`, data);
  }

  deleteQuery(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/queries/${id}`);
  }

  // Search
  searchQueries(filters: SearchFilters): Observable<PaginatedResponse<NasaApodQuery>> {
    return this.apiService.get<PaginatedResponse<NasaApodQuery>>(
      `${this.endpoint}/queries/search`, 
      filters
    );
  }

  // NASA API Integration
  getTodayApod(): Observable<NasaApodQuery> {
    return this.apiService.get<NasaApodQuery>(`${this.endpoint}/today`);
  }

  getApodByDate(date: string): Observable<NasaApodQuery> {
    return this.apiService.get<NasaApodQuery>(`${this.endpoint}/date`, { date });
  }

  getApod(date: string): Observable<NasaApodQuery> {
    return this.apiService.post<NasaApodQuery>(`${this.endpoint}/get`, { date });
  }

  // Health & Test
  healthCheck(): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/health`);
  }
}