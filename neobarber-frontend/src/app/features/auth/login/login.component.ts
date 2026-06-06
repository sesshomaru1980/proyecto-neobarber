import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  // Recuperar contraseña
  showRecover = false;
  recoverEmail = '';
  recoverSuccess = false;
  recoverError = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  /**
   * Inicia sesión y redirige según el rol del usuario.
   */
  login() {
    this.error = '';

    if (!this.email.trim()) {
      this.error = 'El correo electrónico es obligatorio';
      return;
    }

    if (!this.password.trim()) {
      this.error = 'La contraseña es obligatoria';
      return;
    }

    this.auth.login(this.email.trim(), this.password).subscribe({
      next: () => {
        const role = this.auth.role();

        if (role === 'Admin') {

  this.router.navigate([
    '/admin'
  ]);

  return;
}

        if (role === 'Barber') {
          this.router.navigate(['/barber-panel/agenda']);
          return;
        }

        this.router.navigate(['/appointments']);
      },
      error: (e) => {
        let msg = e?.error?.error || e?.error?.message || '';

        if (msg.includes('"email" is not allowed to be empty')) {
          msg = 'El correo electrónico es obligatorio';
        }

        if (msg.includes('"password" is not allowed to be empty')) {
          msg = 'La contraseña es obligatoria';
        }

        if (msg.includes('"email" must be a valid email')) {
          msg = 'El correo electrónico no es válido';
        }

        this.error = msg || 'No se pudo iniciar sesión';
      }
    });
  }

  /**
   * Abre el modal de recuperación.
   */
  openRecover() {
    this.showRecover = true;
    this.recoverSuccess = false;
    this.recoverError = '';
    this.recoverEmail = '';
  }

  /**
   * Cierra el modal de recuperación.
   */
  closeRecover() {
    this.showRecover = false;
    this.recoverError = '';
    this.recoverSuccess = false;
  }

  /**
   * Valida si el correo tiene un formato válido.
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Envía la solicitud de recuperación.
   * Por ahora solo valida el correo y muestra éxito.
   */
  sendRecover() {
    this.recoverError = '';
    this.recoverSuccess = false;

    const email = this.recoverEmail.trim();

    if (!email) {
      this.recoverError = 'El correo electrónico es obligatorio';
      return;
    }

    if (!this.isValidEmail(email)) {
      this.recoverError = 'Debes ingresar un correo electrónico válido';
      return;
    }

    this.recoverSuccess = true;
  }
}