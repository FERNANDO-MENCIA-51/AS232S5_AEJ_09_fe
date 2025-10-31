// Tipo para las clasificaciones posibles de AI Detection
export type AiClassification =
  | 'AI_GENERATED'
  | 'HUMAN_WRITTEN'
  | 'MIXED_CONTENT'
  | 'UNCERTAIN'
  | 'PARSE_ERROR'
  | 'CONNECTION_ERROR';

// Respuesta del endpoint de detección en tiempo real
export interface AiDetectionResponse {
  text: string;
  aiProbability: number;
  classification: AiClassification;
  lang: string;
}

// Item del historial de consultas
export interface AiDetectionHistoryItem {
  id: number;
  text: string;
  lang: string;
  aiProbability: number;
  classification: AiClassification;
  createdAt: string;
}

// Request para detectar contenido IA
export interface AiDetectionRequest {
  text: string;
  lang?: string;
}

// Interfaces legacy (mantener por compatibilidad)
export interface AiDetectionQuery {
  id: number;
  text: string;
  lang: string;
  aiProbability: number;
  classification: string;
  createdAt: string;
}

export interface CreateAiDetectionQuery {
  text: string;
  lang?: string;
  aiProbability?: number;
  classification?: string;
}

export interface UpdateAiDetectionQuery {
  text?: string;
  lang?: string;
  aiProbability?: number;
  classification?: string;
}