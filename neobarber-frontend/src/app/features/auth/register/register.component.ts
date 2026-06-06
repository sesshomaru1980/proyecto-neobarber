import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  role = 'Client';
  msg = '';
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  submit() {
    this.msg = '';
    this.error = '';
    this.api.post('/api/auth/register', {
  fullName: this.fullName,
  email: this.email,
  password: this.password,
  role: 'Client'
}).subscribe({
      next: () => {
        this.msg = 'Usuario registrado correctamente ✅';
        setTimeout(() => this.router.navigate(['/auth/login']), 1200);
      },
      error: e => {
  let msg = e?.error?.error || '';

  if (msg.includes('"fullName" is not allowed to be empty')) {
    msg = 'El nombre completo es obligatorio';
  }

  if (msg.includes('"email" is not allowed to be empty')) {
    msg = 'El correo electrónico es obligatorio';
  }

  if (msg.includes('"password" is not allowed to be empty')) {
    msg = 'La contraseña es obligatoria';
  }

  if (msg.includes('"password" length must be at least')) {
    msg = 'La contraseña debe tener mínimo 6 caracteres';
  }

  if (msg.includes('"email" must be a valid email')) {
    msg = 'Debe ingresar un correo electrónico válido';
  }

  this.error = msg || 'No se pudo registrar';
}
    });
  }
}
