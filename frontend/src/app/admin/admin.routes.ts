import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: Dashboard,
    title: 'Admin Dashboard',
  },
];
