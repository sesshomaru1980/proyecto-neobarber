import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/api.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-barber-agenda',
  templateUrl: './barber-agenda.component.html',
  styleUrls: ['./barber-agenda.component.css']
})
export class BarberAgendaComponent implements OnInit {

  // Lista de citas del barbero autenticado
  appointments: any[] = [];

  // Estado de carga de la agenda
  loading = false;

  // Mensajes para mostrar en la vista
  error = '';
  msg = '';

  constructor(
    private api: ApiService,
    public auth: AuthService
  ) {}

  /**
   * Al iniciar el componente, carga la agenda del barbero.
   */
  ngOnInit(): void {
    this.loadAppointments();
  }

  /**
   * Consulta las citas del barbero autenticado.
   * Esta vista debe consumir la ruta /api/appointments/barber.
   */
  loadAppointments(): void {
    this.loading = true;
    this.error = '';

    this.api.get<any>('/api/appointments/barber').subscribe({
      next: (res) => {
        console.log('Agenda del barbero:', res);

        // El backend devuelve { success: true, data: [...] }
        if (res?.success && Array.isArray(res.data)) {
          this.appointments = res.data;
        }
        // Compatibilidad si por alguna razón viniera un array directo
        else if (Array.isArray(res)) {
          this.appointments = res;
        }
        // Si el formato no es el esperado, deja la agenda vacía
        else {
          this.appointments = [];
        }

        this.loading = false;
      },
      error: (e) => {
        console.error('ERROR CARGANDO CITAS:', e);

        this.error =
          e?.error?.error ||
          e?.error?.message ||
          'No se pudo cargar la agenda.';

        this.appointments = [];
        this.loading = false;
      }
    });
  }

  /**
   * Actualiza el estado de una cita.
   */
  updateStatus(appointmentId: string, status: string): void {
    this.msg = '';
    this.error = '';

    this.api.put(`/api/appointments/${appointmentId}/status`, { status }).subscribe({
      next: () => {
        this.msg = `Cita actualizada a estado: ${status} ✅`;
        this.loadAppointments();
      },
      error: (e) => {
        console.error('ERROR ACTUALIZANDO ESTADO:', e);

        this.error =
          e?.error?.error ||
          e?.error?.message ||
          'No se pudo actualizar el estado de la cita.';
      }
    });
  }

  /**
   * Obtiene el nombre del cliente.
   * Soporta name y fullName.
   */
  getClientName(a: any): string {
    return a?.client?.fullName || a?.client?.name || 'Cliente';
  }

  /**
   * Obtiene el nombre del servicio.
   */
  getServiceName(a: any): string {
    return a?.service?.name || 'Servicio';
  }

  /**
   * Permite confirmar una cita pendiente.
   */
  canConfirm(status: string): boolean {
    return status === 'Pendiente';
  }

  /**
   * Permite completar una cita confirmada.
   */
  canComplete(status: string): boolean {
    return status === 'Confirmada';
  }

  /**
   * Permite cancelar citas pendientes o confirmadas.
   */
  canCancel(status: string): boolean {
    return status === 'Pendiente' || status === 'Confirmada';
  }
}