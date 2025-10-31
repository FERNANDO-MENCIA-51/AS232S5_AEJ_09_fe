import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../../shared/components/toast/toast.component';

/**
 * Service for displaying toast notifications
 * Manages toast messages with different types and durations
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  /**
   * Show a toast notification
   * @param message - The message to display
   * @param type - Toast type (success, error, warning, info)
   * @param duration - Duration in milliseconds (0 for persistent)
   */
  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 3000) {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type, duration };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  /**
   * Show a success toast notification
   * @param message - The success message to display
   * @param duration - Duration in milliseconds (default: 3000)
   */
  showSuccess(message: string, duration = 3000) {
    this.show(message, 'success', duration);
  }

  /**
   * Show an error toast notification
   * @param message - The error message to display
   * @param duration - Duration in milliseconds (default: 5000)
   */
  showError(message: string, duration = 5000) {
    this.show(message, 'error', duration);
  }

  /**
   * Show a warning toast notification
   * @param message - The warning message to display
   * @param duration - Duration in milliseconds (default: 4000)
   */
  showWarning(message: string, duration = 4000) {
    this.show(message, 'warning', duration);
  }

  /**
   * Show an info toast notification
   * @param message - The info message to display
   * @param duration - Duration in milliseconds (default: 3000)
   */
  showInfo(message: string, duration = 3000) {
    this.show(message, 'info', duration);
  }

  // Alias methods for backward compatibility

  /**
   * Alias for showSuccess
   * @param message - The success message to display
   * @param duration - Duration in milliseconds (default: 3000)
   */
  success(message: string, duration = 3000) {
    this.showSuccess(message, duration);
  }

  /**
   * Alias for showError
   * @param message - The error message to display
   * @param duration - Duration in milliseconds (default: 5000)
   */
  error(message: string, duration = 5000) {
    this.showError(message, duration);
  }

  /**
   * Alias for showWarning
   * @param message - The warning message to display
   * @param duration - Duration in milliseconds (default: 4000)
   */
  warning(message: string, duration = 4000) {
    this.showWarning(message, duration);
  }

  /**
   * Alias for showInfo
   * @param message - The info message to display
   * @param duration - Duration in milliseconds (default: 3000)
   */
  info(message: string, duration = 3000) {
    this.showInfo(message, duration);
  }

  /**
   * Remove a specific toast by ID
   * @param id - The toast ID to remove
   */
  remove(id: string) {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(toast => toast.id !== id));
  }

  /**
   * Clear all toast notifications
   */
  clear() {
    this.toastsSubject.next([]);
  }
}