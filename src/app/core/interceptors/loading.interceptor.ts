import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

/**
 * Contador de peticiones HTTP activas
 * Se usa para controlar cuándo mostrar/ocultar el loading spinner
 */
let activeRequests = 0;

/**
 * HTTP Interceptor para gestionar el estado de carga global
 * Muestra un loading spinner mientras hay peticiones HTTP activas
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);

    // Incrementar contador y mostrar loading si es la primera petición
    if (activeRequests === 0) {
        loadingService.show();
    }
    activeRequests++;

    return next(req).pipe(
        finalize(() => {
            // Decrementar contador y ocultar loading si no hay más peticiones
            activeRequests--;
            if (activeRequests === 0) {
                loadingService.hide();
            }
        })
    );
};
