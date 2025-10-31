import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Servicio para gestionar el estado de carga global de la aplicación
 */
@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$: Observable<boolean> = this.loadingSubject.asObservable();

    /**
     * Muestra el indicador de carga
     */
    show(): void {
        this.loadingSubject.next(true);
    }

    /**
     * Oculta el indicador de carga
     */
    hide(): void {
        this.loadingSubject.next(false);
    }

    /**
     * Obtiene el estado actual de carga
     */
    isLoading(): boolean {
        return this.loadingSubject.value;
    }
}
