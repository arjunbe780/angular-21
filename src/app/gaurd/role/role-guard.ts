import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/AuthService';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getUserRole(); // e.g., returns 'user'
  const expectedRole = route.data['expectedRole'];

  // Check if user has the required role
  if (authService.isLoggedIn() && expectedRole.includes(userRole)) {
    return true;
  }

  // Unauthorized? Redirect to login or access-denied page
  router.navigate(['/unauthorized']);
  return false;
};