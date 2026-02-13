import { CanActivateFn, Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '@service/auth/auth';

export const roleRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const userRole = authService.getUserRole();

  if (userRole === 'provider') {
    return router.createUrlTree(['/provider/dashboard']);
  }

  if (userRole === 'customer') {
    return router.createUrlTree(['/customer/dashboard']);
  }

  return router.createUrlTree(['/login']); 
};