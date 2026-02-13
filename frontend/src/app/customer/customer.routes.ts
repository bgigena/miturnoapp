import { Routes } from '@angular/router';
import { Dashboard } from '@customer/components/dashboard/dashboard';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: 'dashboard', // Esto resulta en la ruta completa: /customer/dashboard
    component: Dashboard,
    title: 'Customer Dashboard',
  },
  // Aquí puedes agregar más rutas de cliente: 'profile', 'orders', etc.
];