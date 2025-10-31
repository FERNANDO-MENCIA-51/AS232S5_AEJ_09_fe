// Respuesta del endpoint de NASA APOD (today, date, get)
export interface NasaApodResponse {
  copyright?: string;
  date: string;
  explanation: string;
  hdUrl?: string;
  mediaType: 'image' | 'video';
  serviceVersion: string;
  title: string;
  url: string;
  status: 'SUCCESS' | 'ERROR';
}

// Item del historial de consultas NASA APOD
export interface NasaApodHistoryItem {
  id: number;
  requestedDate: string;
  title: string;
  explanation: string;
  imageUrl: string;
  hdImageUrl?: string;
  mediaType: 'image' | 'video';
  copyright?: string;
  status: 'SUCCESS' | 'ERROR';
  createdAt: string;
}

// Request para obtener APOD por fecha
export interface NasaApodRequest {
  date?: string;
}

// Filtros para búsqueda en historial
export interface NasaHistoryFilters {
  mediaType?: 'image' | 'video';
  status?: 'SUCCESS' | 'ERROR';
  limit?: number;
}

// Interfaces legacy (mantener por compatibilidad)
export interface NasaApodQuery {
  id: number;
  requestedDate: string;
  title: string;
  explanation: string;
  imageUrl: string;
  hdImageUrl: string;
  mediaType: string;
  copyright: string;
  status: string;
  createdAt: string;
}

export interface CreateNasaApodQuery {
  requestedDate: string;
  title?: string;
  explanation?: string;
  imageUrl?: string;
  hdImageUrl?: string;
  mediaType?: string;
  copyright?: string;
  status?: string;
}