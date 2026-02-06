import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Added 'const' here
  const token = localStorage.getItem('token');

  console.log('Route:', route);
  console.log('State:', state);

  if (!token) {
    router.navigateByUrl('login');
    return false;
  }
  router.navigateByUrl('home');
  return true;
};
