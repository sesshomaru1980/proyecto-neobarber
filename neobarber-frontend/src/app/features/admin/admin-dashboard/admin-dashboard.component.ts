import {
  Component,
  OnInit
} from '@angular/core';

import { AdminService } from '../admin.service';
@Component({

  selector:
    'app-admin-dashboard',

  templateUrl:
    './admin-dashboard.component.html',

  styleUrls: [
    './admin-dashboard.component.css'
  ]
})

export class AdminDashboardComponent
implements OnInit {

  loading = true;

  error = '';

  dashboard: any = {

    clients: 0,

    barbers: 0,

    services: 0,

    appointments: 0,

    pendingAppointments: 0,

    confirmedAppointments: 0,

    cancelledAppointments: 0,

    blockedAppointments: 0,

    income: 0,

    latestAppointments: []
  };

  constructor(

    private adminService:
    AdminService
  ) {}

  ngOnInit(): void {

    this.loadDashboard();
  }

  loadDashboard(): void {

    this.loading = true;

    this.adminService
      .getDashboard()
      .subscribe({

        next: (data) => {

          this.dashboard =
            data;

          this.loading =
            false;
        },

        error: (err) => {

          console.error(err);

          this.error =
            'No se pudo cargar el dashboard';

          this.loading =
            false;
        }
      });
  }
}