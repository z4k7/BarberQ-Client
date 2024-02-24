import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-navbar',
  templateUrl: './vendor-navbar.component.html',
  styleUrls: ['./vendor-navbar.component.css'],
})
export class VendorNavbarComponent {
  constructor(private router: Router) {}

  onLogout(): void {
    localStorage.removeItem('vendorJwtAccess');
    localStorage.removeItem('vendorJwtRefresh');
    this.router.navigate(['/vendor/login']);
  }
}
