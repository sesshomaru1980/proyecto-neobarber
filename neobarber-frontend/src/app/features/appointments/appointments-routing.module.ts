import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsListComponent } from './appointments-list/appointments-list.component';
import { AppointmentCreateComponent } from './appointment-create/appointment-create.component';

const routes: Routes = [
  { path: '', component: AppointmentsListComponent },
  { path: 'create', component: AppointmentCreateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule {}
