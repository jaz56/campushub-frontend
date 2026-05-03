import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  console.log('AuthGuard - isLoggedIn:', auth.isLoggedIn);
  console.log('AuthGuard - currentUser:', auth.currentUser);
  if (auth.isLoggedIn) return true;
  return router.createUrlTree(['/auth/login']);

};