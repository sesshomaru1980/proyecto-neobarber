import { Component } from '@angular/core';
import { ApiService } from '../../../core/api.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-barber-block',
  templateUrl: './barber-block.component.html',
  styleUrls: ['./barber-block.component.css']
})
export class BarberBlockComponent {
  startAt = '';
  endAt = '';
  reason = 'Bloqueo';
  msg = '';
  error = '';

  constructor(private api: ApiService, private auth: AuthService) {}

  block() {
    this.msg = '';
    this.error = '';
    const barberId = this.auth.userId();
    this.api.post('/api/availability/block', {
      barberId,
      startAt: new Date(this.startAt).toISOString(),
      endAt: new Date(this.endAt).toISOString(),
      reason: this.reason
    }).subscribe({
      next: () => this.msg = 'Bloqueo creado correctamente ✅',
      error: e => {
        console.error('ERROR CREANDO BLOQUEO:', e);
        this.error = e?.error?.error || 'No se pudo crear el bloqueo.';
      }
    });
  }
}
