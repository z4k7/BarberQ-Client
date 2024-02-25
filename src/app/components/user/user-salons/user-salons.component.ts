import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-salons',
  templateUrl: './user-salons.component.html',
  styleUrls: ['./user-salons.component.css']
})
export class UserSalonsComponent {
  constructor(private router: Router) { }
  
  onLogout(): void{
    localStorage.removeItem('userJwtAccess')
    localStorage.removeItem('userJwtRefresh')
    this.router.navigate(['/user'])
  }

}
