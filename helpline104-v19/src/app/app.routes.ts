import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'role-selection',
    loadComponent: () => import('./features/dashboard/role-selection/role-selection').then(m => m.RoleSelectionComponent)
  },
  {
    path: '',
    loadComponent: () => import('./core/layout/main-layout/main-layout').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.Dashboard)
      },
      // Other authenticated routes go here
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
