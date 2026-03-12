import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  showNavbar = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const hiddenRoutes = ['/', '/auth/login', '/auth/register'];
        this.showNavbar = !hiddenRoutes.includes(this.router.url);
      });
  }
}
