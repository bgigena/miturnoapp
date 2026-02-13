import { Routes } from '@angular/router';
import { Dashboard } from '@provider/components/dashboard/dashboard';

export const PROVIDER_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: Dashboard,
    title: 'Provider Dashboard',
  },
  
];