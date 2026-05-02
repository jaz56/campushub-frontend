import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn && auth.isAdmin) return true;
  if (!auth.isLoggedIn) return router.createUrlTree(['/auth/login']);
  // Connecté mais pas admin → redirige vers son dashboard
  const roles = auth.currentUser?.roles;
  if (roles?.includes('ENSEIGNANT')) return router.createUrlTree(['/enseignant/dashboard']);
  return router.createUrlTree(['/etudiant/dashboard']);
};