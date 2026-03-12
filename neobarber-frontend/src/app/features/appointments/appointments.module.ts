import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsListComponent } from './appointments-list/appointments-list.component';
import { AppointmentCreateComponent } from './appointment-create/appointment-create.component';

@NgModule({
  declarations: [AppointmentsListComponent, AppointmentCreateComponent],
  imports: [CommonModule, FormsModule, AppointmentsRoutingModule]
})
export class AppointmentsModule {}
