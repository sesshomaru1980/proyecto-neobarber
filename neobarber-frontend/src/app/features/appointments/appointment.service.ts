import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AppointmentService {

  private apiUrl =
    'http://localhost:3000/api/appointments';

  constructor(
    private http: HttpClient
  ) {}

  // ============================================
  // CREAR CITA
  // ============================================

  create(
    data: any
  ): Observable<any> {

    return this.http.post(

      this.apiUrl,

      data
    );
  }

  // ============================================
  // MIS CITAS
  // ============================================

  listByUser():
  Observable<any[]> {

    return this.http.get<any[]>(

      `${this.apiUrl}/me`
    );
  }

  // ============================================
  // AGENDA BARBERO
  // ============================================

  listBarberAgenda():
  Observable<any[]> {

    return this.http.get<any[]>(

      `${this.apiUrl}/barber`
    );
  }

  // ============================================
  // BLOQUEAR HORARIO
  // ============================================

  blockSchedule(
    data: any
  ): Observable<any> {

    return this.http.post(

      `${this.apiUrl}/block`,

      data
    );
  }
// ============================================
// CONFIRMAR
// ============================================

confirm(
  id: string
): Observable<any> {

  return this.http.patch(

    `${this.apiUrl}/${id}/confirm`,

    {}
  );
}
  // ============================================
  // CANCELAR
  // ============================================

  cancel(
    id: string
  ): Observable<any> {

    return this.http.patch(

      `${this.apiUrl}/${id}/cancel`,

      {}
    );
  }
}