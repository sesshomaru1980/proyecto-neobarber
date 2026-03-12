import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private router: Router) {}
  goLogin(): void { this.router.navigate(['/auth/login']); }
  goRegister(): void { this.router.navigate(['/auth/register']); }
}
