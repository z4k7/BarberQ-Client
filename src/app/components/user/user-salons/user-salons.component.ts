import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-salons',
  templateUrl: './user-salons.component.html',
  styleUrls: ['./user-salons.component.css']
})
export class UserSalonsComponent implements OnInit {

  Salons:any[] = []

  constructor(private router: Router,
  private toastr: ToastrService,
  private userService:UserService) { }
  
  onLogout(): void{
    localStorage.removeItem('userJwtAccess')
    localStorage.removeItem('userJwtRefresh')
    this.router.navigate(['/user'])
  }


  ngOnInit(): void {
    this.userService.getSalons().subscribe((salons) => {
      this.Salons = salons?.data?.salonData
      
      console.log('Salons',this.Salons)
      })
  }


}
