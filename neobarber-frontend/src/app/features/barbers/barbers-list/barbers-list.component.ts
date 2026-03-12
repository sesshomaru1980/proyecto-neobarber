import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/api.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-barbers-list',
  templateUrl: './barbers-list.component.html',
  styleUrls: ['./barbers-list.component.css']
})
export class BarbersListComponent implements OnInit {
  // Lista de barberos cargados desde backend
  barbers: any[] = [];

  // Mensajes para la vista
  error = '';
  msg = '';

  // Indica si el usuario actual es admin
  isAdmin = false;

  // Controla si el formulario está en modo edición
  isEditing = false;

  // ID del usuario barbero que se está editando
  editingUserId = '';

  // Modelo del formulario
  form = {
    fullName: '',
    email: '',
    password: '',
    bio: '',
    imageUrl: ''
  };

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit() {
    this.isAdmin = this.auth.role() === 'Admin';
    this.load();
  }

  /**
   * Carga la lista de barberos.
   */
  load() {
    this.api.get<any[]>('/api/barbers').subscribe({
      next: (d) => {
        this.barbers = d || [];
      },
      error: (e) => {
        console.error('ERROR CARGANDO BARBEROS:', e);
        this.error = 'No se pudieron cargar los barberos.';
      }
    });
  }

  /**
   * Obtiene el userId real del barbero.
   */
  getBarberUserId(barber: any): string {
    return barber?.userId?._id || barber?.userId || barber?._id || '';
  }

  /**
   * Obtiene el nombre visible del barbero.
   */
  getBarberName(barber: any): string {
    return barber?.userId?.fullName || barber?.fullName || 'Barbero';
  }

  /**
   * Obtiene el email visible del barbero.
   */
  getBarberEmail(barber: any): string {
    return barber?.userId?.email || barber?.email || '';
  }

  /**
   * Obtiene el estado activo/inactivo.
   */
  isBarberActive(barber: any): boolean {
    return barber?.userId?.isActive ?? barber?.isActive ?? true;
  }

  /**
   * Obtiene la URL de la imagen del barbero.
   */
  getBarberImage(barber: any): string {
    return barber?.imageUrl || '';
  }

  /**
   * Indica si hay imagen válida.
   */
  hasImage(url: string): boolean {
    return !!url && url.trim().length > 0;
  }

  /**
   * Limpia el formulario.
   */
  resetForm() {
    this.isEditing = false;
    this.editingUserId = '';
    this.form = {
      fullName: '',
      email: '',
      password: '',
      bio: '',
      imageUrl: ''
    };
  }

  /**
   * Carga los datos del barbero en el formulario para edición.
   */
  edit(barber: any) {
    this.msg = '';
    this.error = '';

    this.isEditing = true;
    this.editingUserId = this.getBarberUserId(barber);

    this.form.fullName = this.getBarberName(barber);
    this.form.email = this.getBarberEmail(barber);
    this.form.password = '';
    this.form.bio = barber?.bio || '';
    this.form.imageUrl = barber?.imageUrl || '';
  }

  /**
   * Guarda el formulario.
   * - Si no está editando: crea un nuevo barbero.
   * - Si está editando: actualiza nombre, correo, bio e imagen.
   */
  save() {
    this.msg = '';
    this.error = '';

    if (!this.form.fullName.trim()) {
      this.error = 'El nombre completo es obligatorio.';
      return;
    }

    if (!this.form.email.trim()) {
      this.error = 'El correo es obligatorio.';
      return;
    }

    if (!this.isEditing) {
      if (!this.form.password.trim()) {
        this.error = 'La contraseña es obligatoria para crear un barbero.';
        return;
      }

      const payload = {
        fullName: this.form.fullName.trim(),
        email: this.form.email.trim(),
        password: this.form.password.trim(),
        bio: this.form.bio.trim(),
        imageUrl: this.form.imageUrl.trim(),
        weeklyAvailability: []
      };

      this.api.post<any>('/api/barbers/admin-create', payload).subscribe({
        next: () => {
          this.msg = 'Barbero creado correctamente ✅';
          this.resetForm();
          this.load();
        },
        error: (e) => {
          console.error('ERROR CREANDO BARBERO:', e);
          this.error =
            e?.error?.error ||
            e?.error?.message ||
            'No se pudo crear el barbero.';
        }
      });

      return;
    }

    const updatePayload = {
      userId: this.editingUserId,
      fullName: this.form.fullName.trim(),
      email: this.form.email.trim(),
      bio: this.form.bio.trim(),
      imageUrl: this.form.imageUrl.trim(),
      weeklyAvailability: []
    };

    this.api.put<any>('/api/barbers/admin-update', updatePayload).subscribe({
      next: () => {
        this.msg = 'Barbero actualizado correctamente ✅';
        this.resetForm();
        this.load();
      },
      error: (e) => {
        console.error('ERROR ACTUALIZANDO BARBERO:', e);
        this.error =
          e?.error?.error ||
          e?.error?.message ||
          'No se pudo actualizar el barbero.';
      }
    });
  }

  /**
   * Cambia el estado activo/inactivo del barbero.
   */
  toggleActive(barber: any) {
    const userId = this.getBarberUserId(barber);

    if (!userId) {
      this.error = 'No se pudo identificar el usuario del barbero.';
      return;
    }

    const currentActive = this.isBarberActive(barber);
    const nextActive = !currentActive;

    const actionText = nextActive ? 'activar' : 'desactivar';
    const ok = confirm(`¿Seguro que deseas ${actionText} a ${this.getBarberName(barber)}?`);
    if (!ok) return;

    this.msg = '';
    this.error = '';

    this.api.patch(`/api/barbers/${userId}/active`, { isActive: nextActive }).subscribe({
      next: () => {
        this.msg = nextActive
          ? 'Barbero activado correctamente ✅'
          : 'Barbero desactivado correctamente ✅';

        this.load();
      },
      error: (e) => {
        console.error('ERROR CAMBIANDO ESTADO DEL BARBERO:', e);
        this.error =
          e?.error?.error ||
          e?.error?.message ||
          'No se pudo cambiar el estado del barbero.';
      }
    });
  }
}