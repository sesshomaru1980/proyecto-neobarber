import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { RoleGuard } from './core/role.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'services',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/services/services.module').then(m => m.ServicesModule)
  },
  {
    path: 'barbers',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/barbers/barbers.module').then(m => m.BarbersModule)
  },
  {
    path: 'appointments',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/appointments/appointments.module').then(m => m.AppointmentsModule)
  },
  {
    path: 'barber-panel',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Barber', 'Admin'] },
    loadChildren: () => import('./features/barber-panel/barber-panel.module').then(m => m.BarberPanelModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
