import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

export const authGuard = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  if (authService.isUserAuthenticated()) {
    return true;
  }
  router.navigate(['/login'], { replaceUrl: true });
  return false;
};
