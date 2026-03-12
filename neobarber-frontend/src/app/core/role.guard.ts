import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowed = route.data['roles'] as string[] | undefined;
    if (!allowed) return true;
    const role = this.auth.role();
    if (role && allowed.includes(role)) return true;
    this.router.navigate(['/services']);
    return false;
  }
}
