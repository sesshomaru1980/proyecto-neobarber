import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/api.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.css']
})
export class AppointmentCreateComponent implements OnInit {

  // ============================================
  // LISTA DE BARBEROS
  // ============================================

  barbers: any[] = [];

  // ============================================
  // LISTA DE SERVICIOS
  // ============================================

  services: any[] = [];


// ============================================
// DATOS DEL FORMULARIO
// ============================================

barberId: string = '';

serviceId: string = '';

startAt: string = '';

notes: string = '';

// ============================================
// FECHA MÍNIMA PERMITIDA
// ============================================

minDateTime: string = '';

// ============================================
// MENSAJES
// ============================================

msg: string = '';

error: string = '';

showSuccessModal = false;

successMessage = '';
showErrorModal = false;

errorMessage = '';

// ============================================
// PREVIEWS
// ============================================

selectedBarber: any = null;

selectedService: any = null;
  constructor(
    private api: ApiService,
    public auth: AuthService
  ) {}

  // ============================================
  // CARGAR COMPONENTE
  // ============================================

  ngOnInit(): void {

    // ============================================
    // CONFIGURAR FECHA MÍNIMA
    // ============================================

    const now = new Date();

    now.setMinutes(
      now.getMinutes() -
      now.getTimezoneOffset()
    );

    this.minDateTime =
      now.toISOString().slice(0, 16);

    // ============================================
    // OBTENER BARBEROS
    // ============================================

    this.api
      .get<any[]>('/api/barbers')
      .subscribe({

        next: (data) => {

          this.barbers = data || [];
        },

        error: () => {

         this.errorMessage =
  'error cargando barberos.';

this.showErrorModal =
  true;
        }
      });

    // ============================================
    // OBTENER SERVICIOS
    // ============================================

    this.api
      .get<any[]>('/api/services')
      .subscribe({

        next: (data) => {

          this.services = data || [];
        },

        error: () => {

         this.errorMessage =
  'error cargando servicios.';

this.showErrorModal =
  true;
        }
      });
  }

  // ============================================
  // OBTENER ID DEL BARBERO
  // ============================================

  getBarberId(b: any): string {

    return (
      b?.userId?._id ||
      b?.userId ||
      b?._id ||
      ''
    );
  }

// ============================================
// OBTENER NOMBRE DEL BARBERO
// ============================================

getBarberName(b: any): string {

  return (
    b?.userId?.fullName ||
    b?.fullName ||
    b?.user?.fullName ||
    'Barbero'
  );
}

// ============================================
// BARBERO SELECCIONADO
// ============================================

onBarberChange(): void {

  this.selectedBarber =

    this.barbers.find(

      b =>

        this.getBarberId(b) ===
        this.barberId

    ) || null;
}

// ============================================
// SERVICIO SELECCIONADO
// ============================================

onServiceChange(): void {

  this.selectedService =

    this.services.find(

      s =>

        s._id ===
        this.serviceId

    ) || null;
}
  // ============================================
  // VALIDAR SI ES DOMINGO
  // ============================================

  isSunday(dateValue: string): boolean {

    if (!dateValue) return false;

    const date =
      this.parseLocalDateTime(
        dateValue
      );

    if (!date) return false;

    return date.getDay() === 0;
  }

  // ============================================
  // VALIDAR HORARIO LABORAL
  // ============================================

  // ============================================
// VALIDAR HORARIO LABORAL
// TENIENDO EN CUENTA LA DURACIÓN
// DEL SERVICIO SELECCIONADO
// ============================================

isValidBusinessHour(
  dateValue: string
): boolean {

  if (!dateValue) {
    return false;
  }

  const date =
    this.parseLocalDateTime(
      dateValue
    );

  if (!date) {
    return false;
  }

  // ============================================
  // OBTENER SERVICIO
  // ============================================

  const selectedService =
    this.services.find(

      s =>
        s._id ===
        this.serviceId
    );

  if (!selectedService) {

    return false;
  }

  // ============================================
  // DURACIÓN DEL SERVICIO
  // ============================================

  const duration =
    Number(
      selectedService.durationMinutes
    );

  const day =
    date.getDay();

  const hours =
    date.getHours();

  const minutes =
    date.getMinutes();

  // ============================================
  // NO DOMINGOS
  // ============================================

  if (day === 0) {

    return false;
  }

  // ============================================
  // SOLO CADA 30 MINUTOS
  // ============================================

  if (
    !(
      minutes === 0 ||
      minutes === 30
    )
  ) {

    return false;
  }

  // ============================================
  // APERTURA
  // ============================================

  if (hours < 9) {

    return false;
  }

  // ============================================
  // CALCULAR HORA DE FIN
  // ============================================

  const endDate =
    new Date(

      date.getTime()

      +

      duration * 60000
    );

  // ============================================
  // CIERRE NEGOCIO
  // ============================================

  const closeDate =
    new Date(date);

  closeDate.setHours(
    20,
    0,
    0,
    0
  );

  // ============================================
  // DEBE TERMINAR ANTES
  // DE LAS 20:00
  // ============================================

  if (
    endDate > closeDate
  ) {

    return false;
  }

  return true;
}
  // ============================================
  // CONVERTIR FECHA LOCAL
  // ============================================

  private parseLocalDateTime(
    value: string
  ): Date | null {

    if (!value) {
      return null;
    }

    const normalized =
      value.trim();

    if (
      !normalized.includes('T')
    ) {
      return null;
    }

    const [
      datePart,
      timePart
    ] = normalized.split('T');

    if (
      !datePart ||
      !timePart
    ) {
      return null;
    }

    const datePieces =
      datePart
      .split('-')
      .map(Number);

    const timePieces =
      timePart
      .split(':')
      .map(Number);

    if (
      datePieces.length !== 3 ||
      timePieces.length < 2
    ) {
      return null;
    }

    const [
      year,
      month,
      day
    ] = datePieces;

    const [
      hours,
      minutes
    ] = timePieces;

    const date = new Date(
      year,
      month - 1,
      day,
      hours,
      minutes,
      0,
      0
    );

    if (
      isNaN(date.getTime())
    ) {
      return null;
    }

    return date;
  }

  // ============================================
  // CREAR CITA
  // ============================================

  create(): void {

    // ============================================
    // LIMPIAR MENSAJES
    // ============================================

   this.msg = '';

this.errorMessage = '';

this.showErrorModal = false;

    // ============================================
    // VALIDAR BARBERO
    // ============================================

   if (!this.barberId) {

  this.errorMessage =
    'Debes seleccionar un barbero.';

  this.showErrorModal =
    true;

  return;
}

    // ============================================
    // VALIDAR SERVICIO
    // ============================================

    if (!this.serviceId) {

     this.errorMessage =
  'Debes seleccionar un servicio.';

this.showErrorModal =
  true;

      return;
    }

    // ============================================
    // VALIDAR FECHA
    // ============================================

    if (!this.startAt) {

     this.errorMessage =
  'Debes seleccionar una fecha y hora.';

this.showErrorModal =
  true;

      return;
    }

    const parsedDate =
      this.parseLocalDateTime(
        this.startAt
      );

    if (!parsedDate) {

      this.errorMessage =
  'Debes seleccionar una fecha y hora válida.';

this.showErrorModal =
  true;

      return;
    }

    // ============================================
    // VALIDAR FECHAS PASADAS
    // ============================================

    const now = new Date();

    if (parsedDate < now) {

      this.errorMessage =
  'No puedes agendar citas en fechas pasadas.';

this.showErrorModal =
  true;

      return;
    }

    // ============================================
    // VALIDAR DOMINGOS
    // ============================================

    if (
      this.isSunday(this.startAt)
    ) {

      this.errorMessage =
  'No puedes agendar citas los domingos.';

this.showErrorModal =
  true;

      return;
    }

    // ============================================
    // VALIDAR HORARIO
    // ============================================

    const hours =
  parsedDate.getHours();

const minutes =
  parsedDate.getMinutes();

// ============================================
// APERTURA
// ============================================

if (hours < 9) {

  this.errorMessage =
  'La barbería abre a las 09:00 AM. Selecciona una hora igual o posterior a esa.';

this.showErrorModal =
  true;

  return;
}

// ============================================
// SOLO CADA 30 MINUTOS
// ============================================

if (
  !(
    minutes === 0 ||
    minutes === 30
  )
) {

  this.errorMessage =
  'Las citas solo pueden agendarse cada 30 minutos. Selecciona una hora en punto o media hora.';

this.showErrorModal =
  true;

 

  return;
}

// ============================================
// VALIDAR DISPONIBILIDAD
// ============================================

if (
  !this.isValidBusinessHour(
    this.startAt
  )
) {

  this.errorMessage =
  'El horario seleccionado no esta disponible. Asegurate de que la cita termine antes del cierre del negocio a las 20:00 y que no se superponga con otra cita.';

this.showErrorModal =
  true;

  return;
}

    // ============================================
    // CREAR PAYLOAD
    // ============================================

    const payload = {

      barberId:
        this.barberId,

      serviceId:
        this.serviceId,

      startAt:
        parsedDate.toISOString(),

      notes:
        this.notes?.trim() || ''
    };

    console.log(
      'PAYLOAD CITA:',
      payload
    );

    // ============================================
    // ENVIAR PETICIÓN
    // ============================================

    this.api
      .post(
        '/api/appointments',
        payload
      )
      .subscribe({

       next: () => {

  this.showSuccessModal = true;

  this.successMessage =
    'Cita creada correctamente ✅';

  this.barberId = '';

  this.serviceId = '';

  this.startAt = '';

  this.notes = '';

  this.selectedBarber = null;

  this.selectedService = null;
},

       error: (e) => {

  this.errorMessage =

    e?.error?.error ||

    e?.error?.message ||

    'No se pudo crear la cita.';

  this.showErrorModal =
    true;
}
            });
  }

  closeSuccessModal(): void {

    this.showSuccessModal = false;

  }

  closeErrorModal(): void {

  this.showErrorModal = false;

  this.errorMessage = '';

}
}