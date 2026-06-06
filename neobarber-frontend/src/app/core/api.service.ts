import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // URL base del backend
  private baseUrl = environment.apiUrl;

  // Clave exacta con la que AuthService guarda el token
  private tokenKey = 'neobarber_token';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el token JWT desde localStorage.
   */
  private getToken(): string {
    return localStorage.getItem(this.tokenKey) || '';
  }

  /**
   * Construye los headers HTTP.
   * Si hay token, lo envía en Authorization como Bearer token.
   */
  private getOptions() {
    const token = this.getToken();

    // Si no existe token, no agrega Authorization
    if (!token) {
      console.warn('ApiService: no se encontró token en localStorage');
      return {};
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return { headers };
  }

  /**
   * Petición GET
   */
  get<T>(path: string) {
    return this.http.get<T>(`${this.baseUrl}${path}`, this.getOptions());
  }

  /**
   * Petición POST
   */
  post<T>(path: string, body: any) {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, this.getOptions());
  }

  /**
   * Petición PUT
   */
  put<T>(path: string, body: any) {
    return this.http.put<T>(`${this.baseUrl}${path}`, body, this.getOptions());
  }

  /**
   * Petición PATCH
   */
  patch<T>(path: string, body: any = {}) {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body, this.getOptions());
  }

  /**
   * Petición DELETE
   */
  delete<T>(path: string) {
    return this.http.delete<T>(`${this.baseUrl}${path}`, this.getOptions());
  }
}