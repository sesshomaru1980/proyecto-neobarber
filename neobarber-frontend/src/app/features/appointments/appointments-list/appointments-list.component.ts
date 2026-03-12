import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.css']
})
export class AppointmentsListComponent implements OnInit {

  // Lista de citas del cliente autenticado
  list: any[] = [];

  // Mensaje de error para mostrar en pantalla
  error = '';

  constructor(private api: ApiService) {}

  /**
   * Al iniciar el componente, carga las citas del usuario.
   */
  ngOnInit(): void {
    this.loadAppointments();
  }

  /**
   * Consulta las citas del usuario autenticado.
   * El backend responde con un objeto tipo:
   * {
   *   success: true,
   *   data: [...]
   * }
   */
  loadAppointments(): void {
    // Limpia errores previos
    this.error = '';

    this.api.get<any>('/api/appointments/mine').subscribe({
      next: (res) => {
        console.log('Respuesta de mis citas:', res);

        // Si el backend devuelve { success, data }
        if (res?.success && Array.isArray(res.data)) {
          this.list = res.data;
          return;
        }

        // Si por alguna razón devolviera directamente un arreglo
        if (Array.isArray(res)) {
          this.list = res;
          return;
        }

        // Si no viene en formato esperado, deja lista vacía
        this.list = [];
      },
      error: (e) => {
        console.error('Error cargando mis citas:', e);

        this.error =
          e?.error?.error ||
          e?.error?.message ||
          'No se pudieron cargar las citas.';

        this.list = [];
      }
    });
  }
}