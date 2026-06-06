import {
  Component,
  OnInit
} from '@angular/core';

import { AuthService } from '../../../core/auth.service';

import {
  AppointmentService
} from '../../appointments/appointment.service';

import {
  BarberService
} from '../../barbers/barber.service';

@Component({
  selector: 'app-barber-agenda',
  templateUrl: './barber-agenda.component.html',
  styleUrls: ['./barber-agenda.component.css']
})
export class BarberAgendaComponent
implements OnInit {

  // ============================================
  // CITAS
  // ============================================

  list: any[] = [];

  // ============================================
  // ESTADÍSTICAS
  // ============================================

  totalAppointments = 0;

  pendingAppointments = 0;

  confirmedAppointments = 0;

  cancelledAppointments = 0;

  blockedAppointments = 0;
  income = 0;

occupation = 0;

nextAppointment: any = null;

  // ============================================
  // FILTRO
  // ============================================

  filterStatus = 'Todos';

  // ============================================
  // BARBEROS
  // ============================================

  barbers: any[] = [];

  // ============================================
  // ERRORES
  // ============================================

  error = '';

  blockError = '';

  // ============================================
  // MODAL
  // ============================================

  showBlockModal = false;

  // ============================================
  // FORM BLOQUEO
  // ============================================

  blockData = {

  barberId: '',

  startAt: '',

  endAt: '',

  notes: ''

};

  constructor(

    private appointmentService:
    AppointmentService,

    private barberService:
    BarberService,

    public auth:
    AuthService

  ) {}

  // ============================================
  // INIT
  // ============================================

  ngOnInit(): void {

    this.loadAgenda();

    this.loadBarbers();
  }

  // ============================================
  // FILTRAR CITAS
  // ============================================

  get filteredAppointments(): any[] {

    if (
      this.filterStatus ===
      'Todos'
    ) {

      return this.list;
    }

    if (
      this.filterStatus ===
      'Bloqueada'
    ) {

      return this.list.filter(
        a => a.isBlocked
      );
    }

    return this.list.filter(

      a =>
        a.status ===
        this.filterStatus
    );
  }

  // ============================================
  // CARGAR BARBEROS
  // ============================================

  loadBarbers(): void {

    this.barberService
      .getAll()
      .subscribe({

        next: (data) => {

          this.barbers =
            data || [];
        },

        error: (err) => {

          console.error(err);
        }
      });
  }

  // ============================================
  // CARGAR AGENDA
  // ============================================

  loadAgenda(): void {

    this.appointmentService
      .listBarberAgenda()
      .subscribe({

        next: (data) => {

          this.list =
            data || [];

          this.calculateStats();
        },

        error: (err) => {

          console.error(err);

          this.error =
            'No se pudo cargar la agenda';
        }
      });
  }

  // ============================================
  // ESTADÍSTICAS
  // ============================================

  calculateStats(): void {

  this.totalAppointments =
    this.list.length;

  this.pendingAppointments =
    this.list.filter(
      a => a.status === 'Pendiente'
    ).length;

  this.confirmedAppointments =
    this.list.filter(
      a => a.status === 'Confirmada'
    ).length;

  this.cancelledAppointments =
    this.list.filter(
      a => a.status === 'Cancelada'
    ).length;

  this.blockedAppointments =
    this.list.filter(
      a => a.isBlocked
    ).length;

  // =========================
  // INGRESOS
  // =========================

  this.income = this.list
    .filter(
      a =>
        !a.isBlocked &&
        a.serviceId
    )
    .reduce(

      (total, a) =>

        total +

        Number(
          a.serviceId?.price || 0
        ),

      0
    );

  // =========================
  // OCUPACIÓN
  // =========================

  this.occupation =

    this.totalAppointments > 0

      ?

      Math.round(

        (
          this.confirmedAppointments

          /

          this.totalAppointments

        ) * 100

      )

      : 0;

  // =========================
  // PRÓXIMA CITA
  // =========================

  const now =
    new Date();

  this.nextAppointment =

    this.list

      .filter(

        a =>

          !a.isBlocked &&

          new Date(
            a.startAt
          ) > now

      )

      .sort(

        (a, b) =>

          new Date(a.startAt).getTime()

          -

          new Date(b.startAt).getTime()

      )[0] || null;
}

  // ============================================
  // MODAL
  // ============================================

 openBlockModal(): void {

  this.showBlockModal = true;

  this.blockError = '';

  // ============================================
  // SI ES BARBERO
  // ============================================

  if (
    this.auth.role() ===
    'Barber'
  ) {

    const barberId =
      this.auth.userId();

    if (barberId) {

      this.blockData.barberId =
        barberId;
    }
  }
}

  closeBlockModal(): void {

    this.showBlockModal = false;

    this.blockError = '';

    this.blockData = {

      barberId: '',

      startAt: '',
      endAt: '',
      notes: ''
    };
  }

  clearBlockError(): void {

    this.blockError = '';
  }

  // ============================================
  // BLOQUEAR HORARIO
  // ============================================

  blockSchedule(): void {

    if (!this.blockData.barberId) {

      this.blockError =
        'Selecciona un barbero';

      return;
    }

    if (!this.blockData.startAt) {

      this.blockError =
        'Selecciona fecha y hora';

      return;
    }
if (!this.blockData.endAt) {

  this.blockError =
    'Selecciona fecha final';

  return;
}
    const selectedDate =
      new Date(
        this.blockData.startAt
      );

    const now =
      new Date();
const endDate =
  new Date(
    this.blockData.endAt
  );

if (endDate <= selectedDate) {

  this.blockError =
    'La fecha final debe ser posterior a la fecha inicial';

  return;
}
    if (selectedDate < now) {

      this.blockError =
        'No puedes bloquear fechas pasadas';

      return;
    }

    this.blockError = '';

    this.appointmentService
      .blockSchedule(
        this.blockData
      )
      .subscribe({

        next: () => {

          alert(
            'Horario bloqueado correctamente ✅'
          );

          this.closeBlockModal();

          this.loadAgenda();
        },

        error: (err) => {

          console.error(err);

          this.blockError =

            err?.error?.error ||

            'No se pudo bloquear';
        }
      });
  }

  // ============================================
  // CONFIRMAR CITA
  // ============================================

  confirmAppointment(
    id: string
  ): void {

    const ok = confirm(
      '¿Confirmar esta cita?'
    );

    if (!ok) return;

    this.appointmentService
      .confirm(id)
      .subscribe({

        next: () => {

          this.loadAgenda();
        },

        error: (err) => {

          console.error(err);

          alert(

            err?.error?.error ||

            'No se pudo confirmar'
          );
        }
      });
  }

  // ============================================
  // CANCELAR CITA
  // ============================================

  cancelAppointment(
    id: string
  ): void {

    const ok = confirm(
      '¿Cancelar esta cita?'
    );

    if (!ok) return;

    this.appointmentService
      .cancel(id)
      .subscribe({

        next: () => {

          this.loadAgenda();
        },

        error: (err) => {

          console.error(err);
        }
      });
  }
}