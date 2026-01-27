import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Inyectamos el ID de la plataforma
  const platformId = inject(PLATFORM_ID);

  // 2. Verificamos si estamos en el navegador
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');

    if (token) {
      const clonedReq = req.clone({
        setHeaders: {
          auth: `Bearer ${token}`
        }
      });
      return next(clonedReq);
    }
  }

  // Si estamos en el servidor o no hay token, pasamos la petición normal
  return next(req);
};
