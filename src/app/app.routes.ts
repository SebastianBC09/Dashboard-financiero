import { Routes } from '@angular/router';
import { authGuard } from './core/authentication.guard';
import { LoanApplicationFormComponent } from './features/loan-request/loan-application-form/loan-application-form.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/authentication/login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import(
        './features/dashboard/dashboard-main/dashboard-main.component'
      ).then((m) => m.DashboardMainComponent),
    canActivate: [authGuard],
  },
  {
    path: 'loan-application',
    component: LoanApplicationFormComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
