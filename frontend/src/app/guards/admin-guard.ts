import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { NotificationService } from '../services/notification';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  const user = authService.currentUserValue;

  // Verificamos si existe el usuario y si su rol es 'admin'
  if (user && user.role === 'admin') {
    return true;
  }

  // Si no es admin, lo pateamos fuera
  notification.show('Acceso denegado. Se requiere nivel de administrador.', 'is-danger');
  router.navigate(['/']);
  return false;
};
