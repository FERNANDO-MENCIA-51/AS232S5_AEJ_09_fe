import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface AppConfig {
    apiUrl: string;
}

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config: AppConfig | null = null;

    constructor(private http: HttpClient) { }

    async loadConfig(): Promise<void> {
        try {
            this.config = await firstValueFrom(
                this.http.get<AppConfig>('/config.json')
            );
        } catch (error) {
            console.warn('Could not load config.json, using default configuration');
            // Fallback a la configuración por defecto
            this.config = {
                apiUrl: 'http://localhost:9090'
            };
        }
    }

    getApiUrl(): string {
        return this.config?.apiUrl || 'http://localhost:9090';
    }
}
