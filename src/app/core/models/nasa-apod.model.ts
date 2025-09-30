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