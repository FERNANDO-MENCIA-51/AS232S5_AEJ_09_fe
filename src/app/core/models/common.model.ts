export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
  fieldErrors?: { [key: string]: string };
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SearchFilters {
  page?: number;
  size?: number;
  [key: string]: any;
}