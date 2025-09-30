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

export interface AiDetectionResponse {
  text: string;
  aiProbability: number;
  classification: string;
  lang: string;
  status: string;
}