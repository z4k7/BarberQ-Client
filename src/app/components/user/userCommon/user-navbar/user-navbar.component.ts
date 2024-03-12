import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.css'],
})
export class UserNavbarComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    initFlowbite();
  }

  onLogout(): void {
    localStorage.removeItem('userJwtAccess');
    localStorage.removeItem('userJwtRefresh');
    this.router.navigate(['/user/']);
  }
}
