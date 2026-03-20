import { CanActivateFn, Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '@service/auth/auth';

export const roleRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const userRole = authService.getUserRole();

  if (userRole === 'proveedor') {
    return router.createUrlTree(['/provider/dashboard']);
  }

  if (userRole === 'cliente') {
    return router.createUrlTree(['/customer/dashboard']);
  }

  if (userRole === 'admin') {
    return router.createUrlTree(['/admin/dashboard']);
  }

  return router.createUrlTree(['/login']); 
};