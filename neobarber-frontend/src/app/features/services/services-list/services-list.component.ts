import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/api.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.css']
})
export class ServicesListComponent implements OnInit {
  // Lista de servicios
  services: any[] = [];

  // Indica si el usuario actual es admin
  isAdmin = false;

  // Campos para crear servicio
  name = '';
  description = '';
  durationMinutes = 30;
  price = 20000;
  imageUrl = '';

  // Campos para editar servicio
  editingId = '';
  editName = '';
  editDescription = '';
  editDurationMinutes = 30;
  editPrice = 20000;
  editImageUrl = '';
  editIsActive = true;

  // Mensajes para la vista
  msg = '';
  error = '';

  constructor(private api: ApiService, private auth: AuthService) {}

  /**
   * Inicializa el componente.
   */
  ngOnInit(): void {
    this.isAdmin = this.auth.role() === 'Admin';
    this.load();
  }

  /**
   * Carga la lista de servicios desde el backend.
   */
  load(): void {
    this.api.get<any[]>('/api/services').subscribe({
      next: (d) => {
        this.services = d || [];
      },
      error: () => {
        this.error = 'No se pudieron cargar los servicios.';
      }
    });
  }

  /**
   * Crea un nuevo servicio.
   */
  create(): void {
    this.msg = '';
    this.error = '';

    this.api.post('/api/services', {
      name: this.name,
      description: this.description,
      durationMinutes: this.durationMinutes,
      price: this.price,
      imageUrl: this.imageUrl
    }).subscribe({
      next: () => {
        this.msg = 'Servicio creado correctamente ✅';
        this.name = '';
        this.description = '';
        this.durationMinutes = 30;
        this.price = 20000;
        this.imageUrl = '';
        this.load();
      },
      error: (e) => {
        this.error =
          e?.error?.error ||
          e?.error?.message ||
          'No se pudo crear el servicio.';
      }
    });
  }

  /**
   * Inicia la edición de un servicio.
   */
  startEdit(service: any): void {
    this.editingId = service._id;
    this.editName = service.name || '';
    this.editDescription = service.description || '';
    this.editDurationMinutes = service.durationMinutes || 30;
    this.editPrice = service.price || 0;
    this.editImageUrl = service.imageUrl || '';
    this.editIsActive = service.isActive !== false;
    this.msg = '';
    this.error = '';
  }

  /**
   * Cancela la edición actual.
   */
  cancelEdit(): void {
    this.editingId = '';
    this.editName = '';
    this.editDescription = '';
    this.editDurationMinutes = 30;
    this.editPrice = 20000;
    this.editImageUrl = '';
    this.editIsActive = true;
  }

  /**
   * Actualiza un servicio existente.
   */
  update(): void {
    if (!this.editingId) return;

    this.msg = '';
    this.error = '';

    this.api.put(`/api/services/${this.editingId}`, {
      name: this.editName,
      description: this.editDescription,
      durationMinutes: this.editDurationMinutes,
      price: this.editPrice,
      imageUrl: this.editImageUrl,
      isActive: this.editIsActive
    }).subscribe({
      next: () => {
        this.msg = 'Servicio actualizado correctamente ✅';
        this.cancelEdit();
        this.load();
      },
      error: (e) => {
        this.error =
          e?.error?.error ||
          e?.error?.message ||
          'No se pudo actualizar el servicio.';
      }
    });
  }

  /**
   * Elimina un servicio.
   */
  remove(id: string): void {
    const ok = confirm('¿Seguro que deseas eliminar este servicio?');
    if (!ok) return;

    this.msg = '';
    this.error = '';

    this.api.delete(`/api/services/${id}`).subscribe({
      next: () => {
        this.msg = 'Servicio eliminado correctamente ✅';
        this.load();
      },
      error: (e) => {
        this.error =
          e?.error?.error ||
          e?.error?.message ||
          'No se pudo eliminar el servicio.';
      }
    });
  }

  /**
   * Indica si una URL de imagen existe para mostrar preview.
   */
  hasImage(url: string): boolean {
    return !!url && url.trim().length > 0;
  }
}