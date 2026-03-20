import { Routes } from '@angular/router';
import { Login } from '@login/components/login/login';
import { roleRedirectGuard } from '@service/guards/role-redirect';

export const routes: Routes = [
    //Ruta Raíz
{
    path: '',
    canActivate: [roleRedirectGuard],
    // Si la guardia no redirige (ej. no autenticado), 
    // debe caer en un componente válido, como un HomeComponent o LoginComponent.
    component: Login, // <--- PROPORCIONA UN COMPONENTE AQUÍ
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login, // Reemplazar con LoginComponent
  },
  // Rutas del Proveedor (Provider)
  {
    path: 'provider',
    loadChildren: () => import('./provider/provider.routes').then(m => m.PROVIDER_ROUTES),
  },

  // Rutas del Cliente (Customer)
  {
    path: 'customer',
    loadChildren: () => import('./customer/customer.routes').then(m => m.CUSTOMER_ROUTES),
  },

  // Rutas del Admin
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },

  // Ruta Catch-all (404) - Siempre al final
  {
    path: '**',
    redirectTo: '', // Redirige a la página de inicio si la ruta no existe
  },
];