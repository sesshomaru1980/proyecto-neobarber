import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private api: ApiService
  ) {}

  getDashboard(): Observable<any> {

    return this.api.get<any>(
      '/api/admin/dashboard'
    );
  }
}