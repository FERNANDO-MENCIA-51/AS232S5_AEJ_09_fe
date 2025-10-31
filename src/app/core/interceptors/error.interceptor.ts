import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

/**
 * HTTP Interceptor para manejo centralizado de errores
 * Captura errores HTTP y muestra mensajes apropiados al usuario
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const toastService = inject(ToastService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Ha ocurrido un error';

            if (error.error instanceof ErrorEvent) {
                // Error del cliente (red, etc.)
                errorMessage = `Error: ${error.error.message}`;
            } else {
                // Error del servidor
                switch (error.status) {
                    case 400:
                        errorMessage = 'Solicitud inválida. Verifica los datos ingresados.';
                        break;
                    case 404:
                        errorMessage = 'Recurso no encontrado.';
                        break;
                    case 500:
                        errorMessage = 'Error del servidor. Intenta nuevamente más tarde.';
                        break;
                    case 0:
                        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
                        break;
                    default:
                        errorMessage = `Error ${error.status}: ${error.message}`;
                }
            }

            // Mostrar mensaje de error al usuario
            toastService.error(errorMessage);

            // Re-lanzar el error para que los componentes puedan manejarlo si es necesario
            return throwError(() => new Error(errorMessage));
        })
    );
};
