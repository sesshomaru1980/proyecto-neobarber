import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';
import { jwtDecode } from 'jwt-decode';

// Roles permitidos en el sistema
export type Role = 'Admin' | 'Barber' | 'Client';

// Estructura esperada del token JWT
type JwtPayload = {
  sub: string;
  role: Role;
  email: string;
  fullName?: string;
  exp: number;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Clave usada para guardar el token en localStorage
  private tokenKey = 'neobarber_token';

  // Observable del usuario autenticado
  user$ = new BehaviorSubject<JwtPayload | null>(this.getUserFromToken());

  constructor(private api: ApiService) {}

  /**
   * Inicia sesión contra el backend.
   * Guarda el token en localStorage y actualiza el usuario actual.
   */
  login(email: string, password: string) {
    return this.api.post<any>('/api/auth/login', { email, password }).pipe(
      tap(res => {
        // Soporta distintos nombres por si el backend responde diferente
        const token = res?.accessToken || res?.token || '';

        if (!token) {
          throw new Error('El backend no devolvió un token válido.');
        }

        localStorage.setItem(this.tokenKey, token);
        this.user$.next(this.getUserFromToken());
      })
    );
  }

  /**
   * Cierra sesión eliminando el token local.
   */
  logout() {
    localStorage.removeItem(this.tokenKey);
    this.user$.next(null);
  }

  /**
   * Devuelve el token actual.
   */
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Indica si hay un usuario autenticado y el token no está vencido.
   */
  isLoggedIn() {
    const u = this.getUserFromToken();
    return !!u && !this.isExpired(u.exp);
  }

  /**
   * Devuelve el rol del usuario autenticado.
   */
  role(): Role | null {
    return this.getUserFromToken()?.role ?? null;
  }

  /**
   * Devuelve el ID del usuario autenticado.
   */
  userId(): string | null {
    return this.getUserFromToken()?.sub ?? null;
  }

  /**
   * Lee el token, lo decodifica y devuelve el usuario.
   */
  private getUserFromToken(): JwtPayload | null {
    const token = this.getToken();

    if (!token) return null;

    try {
      const payload = jwtDecode<JwtPayload>(token);

      if (this.isExpired(payload.exp)) {
        return null;
      }

      return payload;
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return null;
    }
  }

  /**
   * Verifica si el token ya expiró.
   */
  private isExpired(exp: number) {
    const now = Math.floor(Date.now() / 1000);
    return exp <= now;
  }
}