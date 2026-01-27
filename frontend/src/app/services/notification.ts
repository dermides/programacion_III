import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'is-success' | 'is-danger' | 'is-warning' | 'is-info';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  // Usamos Signals para reactividad instantánea
  toasts = signal<Toast[]>([]);

  show(message: string, type: 'is-success' | 'is-danger' | 'is-warning' | 'is-info') {
    const id = Date.now();
    const newToast: Toast = { id, message, type };

    // Agregamos la notificación al array
    this.toasts.update(current => [...current, newToast]);

    // La eliminamos automáticamente después de 3 segundos
    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  remove(id: number) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
