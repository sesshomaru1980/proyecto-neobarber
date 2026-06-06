import {
  Component,
  OnInit
} from '@angular/core';

import {
  AppointmentService
} from '../appointment.service';

@Component({
  selector: 'app-appointments-list',

  templateUrl:
    './appointments-list.component.html',

  styleUrls: [
    './appointments-list.component.css'
  ]
})

export class AppointmentsListComponent
implements OnInit {

  // ============================================
  // LISTA DE CITAS
  // ============================================

  list: any[] = [];

  // ============================================
  // ESTADOS
  // ============================================

  loading = false;

  error = '';

  constructor(
    private appointmentService:
    AppointmentService
  ) {}

  // ============================================
  // INICIAR COMPONENTE
  // ============================================

  ngOnInit(): void {

    this.loadAppointments();
  }

  // ============================================
  // CARGAR CITAS
  // ============================================

  loadAppointments(): void {

    this.loading = true;

    this.error = '';

    this.appointmentService
      .listByUser()
      .subscribe({

        next: (data) => {

         console.log(
  JSON.stringify(
    data[0],
    null,
    2
  )
);

          // ============================================
          // GUARDAR CITAS
          // ============================================

          this.list =
            data || [];

          this.loading = false;
        },

        error: (err) => {

          console.error(
            'ERROR CARGANDO CITAS:',
            err
          );

          this.error =

            err?.error?.message ||

            'No se pudieron cargar las citas.';

          this.loading = false;
        }
      });
  }

  // ============================================
  // CANCELAR CITA
  // ============================================

  cancelAppointment(
    id: string
  ): void {

    const confirmCancel =
      confirm(
        '¿Deseas cancelar esta cita?'
      );

    if (!confirmCancel) {
      return;
    }

    this.appointmentService
      .cancel(id)
      .subscribe({

        next: () => {

          this.loadAppointments();
        },

        error: (err) => {

          console.error(
            'ERROR CANCELANDO:',
            err
          );

          this.error =

            err?.error?.message ||

            'No se pudo cancelar la cita.';
        }
      });
  }
}