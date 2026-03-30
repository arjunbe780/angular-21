import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Added 'const' here
  const token = localStorage.getItem('token');
  if (!token) {
    router.navigateByUrl('login');
    return false;
  }
  router.navigateByUrl('home');
  return true;
};
