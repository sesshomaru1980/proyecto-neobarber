import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/api.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.css']
})
export class AppointmentCreateComponent implements OnInit {

  // Lista de barberos disponibles
  barbers: any[] = [];

  // Lista de servicios disponibles
  services: any[] = [];

  // IDs seleccionados en el formulario
  barberId = '';
  serviceId = '';

  // Fecha y hora seleccionada
  startAt = '';

  // Notas opcionales de la cita
  notes = '';

  // Mensajes de éxito
  msg = '';

  // Mensajes de error
  error = '';

  // Inyección de servicios
  constructor(
    private api: ApiService,
    public auth: AuthService
  ) {}

  // Se ejecuta al cargar el componente
  ngOnInit() {

    // Obtiene lista de barberos desde la API
    this.api.get<any[]>('/api/barbers')
      .subscribe(d => this.barbers = d || []);

    // Obtiene lista de servicios desde la API
    this.api.get<any[]>('/api/services')
      .subscribe(d => this.services = d || []);
  }

  // Obtiene el ID correcto del barbero dependiendo de la estructura
  getBarberId(b: any): string {
    return b?.userId?._id || b?.userId || b?._id || '';
  }

  // Obtiene el nombre del barbero
  getBarberName(b: any): string {
    return b?.userId?.fullName || b?.fullName || b?.user?.fullName || 'Barbero';
  }

  // Verifica si la fecha seleccionada es domingo
  isSunday(dateValue: string): boolean {

    if (!dateValue) return false;

    const date = this.parseLocalDateTime(dateValue);

    if (!date) return false;

    return date.getDay() === 0;
  }

  // Valida que la hora esté dentro del horario de atención
  isValidBusinessHour(dateValue: string): boolean {

    if (!dateValue) return false;

    const date = this.parseLocalDateTime(dateValue);

    if (!date) return false;

    const day = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // No se permiten domingos
    if (day === 0) return false;

    // Solo intervalos de 30 minutos
    if (!(minutes === 0 || minutes === 30)) return false;

    // Horario mínimo
    if (hours < 9) return false;

    // Horario máximo
    if (hours > 19) return false;

    // Última cita permitida
    if (hours === 19 && minutes > 30) return false;

    return true;
  }

  // Convierte la fecha del input datetime-local a objeto Date
  private parseLocalDateTime(value: string): Date | null {

    if (!value) return null;

    // Se espera formato YYYY-MM-DDTHH:mm
    const normalized = value.trim();

    if (!normalized.includes('T')) {
      return null;
    }

    const [datePart, timePart] = normalized.split('T');

    if (!datePart || !timePart) {
      return null;
    }

    const datePieces = datePart.split('-').map(Number);
    const timePieces = timePart.split(':').map(Number);

    if (datePieces.length !== 3 || timePieces.length < 2) {
      return null;
    }

    const [year, month, day] = datePieces;
    const [hours, minutes] = timePieces;

    const date = new Date(year, month - 1, day, hours, minutes, 0, 0);

    // Verifica que la fecha sea válida
    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  }

  // Método que crea la cita
  create() {

    // Limpia mensajes anteriores
    this.msg = '';
    this.error = '';

    // Validaciones del formulario

    if (!this.barberId) {
      this.error = 'Debes seleccionar un barbero.';
      return;
    }

    if (!this.serviceId) {
      this.error = 'Debes seleccionar un servicio.';
      return;
    }

    if (!this.startAt) {
      this.error = 'Debes seleccionar fecha y hora.';
      return;
    }

    const parsedDate = this.parseLocalDateTime(this.startAt);

    if (!parsedDate) {
      this.error = 'La fecha y hora seleccionadas no son válidas.';
      return;
    }

    if (this.isSunday(this.startAt)) {
      this.error = 'No se pueden agendar citas los domingos.';
      return;
    }

    if (!this.isValidBusinessHour(this.startAt)) {
      this.error =
        'La barbería atiende de lunes a sábado, de 09:00 a 20:00, con citas cada 30 minutos. La última cita permitida es a las 19:30.';
      return;
    }

    // Payload que se envía al backend
    // IMPORTANTE: No se envía clientId ni endAt
    const payload = {
      barberId: this.barberId,
      serviceId: this.serviceId,
      startAt: parsedDate.toISOString(),
      notes: this.notes?.trim() || ''
    };

    // Log para depuración
    console.log('PAYLOAD CITA:', payload);

    // Llamada al backend
    this.api.post('/api/appointments', payload).subscribe({

      // Si la cita se crea correctamente
      next: () => {

        this.msg = 'Cita creada correctamente ✅';

        // Limpia el formulario
        this.barberId = '';
        this.serviceId = '';
        this.startAt = '';
        this.notes = '';
      },

      // Manejo de errores
      error: e => {

        console.error('ERROR CREANDO CITA:', e);

        this.error =
          e?.error?.error ||
          e?.error?.message ||
          'No se pudo crear la cita.';
      }
    });
  }
}