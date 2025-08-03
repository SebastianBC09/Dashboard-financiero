import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

export const authGuard = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.isUserAuthenticated()) {
    return true;
  }

  // Redirigir al login si no está autenticado con replaceUrl para limpiar historial
  router.navigate(['/login'], { replaceUrl: true });
  return false;
};
