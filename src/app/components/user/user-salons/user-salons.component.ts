import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-salons',
  templateUrl: './user-salons.component.html',
  styleUrls: ['./user-salons.component.css'],
})
export class UserSalonsComponent implements OnInit {
  Salons: any[] = [];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  onLogout(): void {
    localStorage.removeItem('userJwtAccess');
    localStorage.removeItem('userJwtRefresh');
    this.router.navigate(['/user']);
  }

  ngOnInit(): void {
    this.userService.getSalons().subscribe((salons) => {
      this.Salons = salons?.data?.salonData;
      console.log('Salons', this.Salons);
    });
  }

  bookChair(salon: any): void {
    this.router.navigate(['/user/salons/book-a-chair'], {
      queryParams: { salon: JSON.stringify(salon) },
    });
  }

  viewSalonDetails(salon: any): void {
    this.router.navigate(['/user/salons/salon-details'], {
      queryParams: { salon: JSON.stringify(salon) },
    });
  }
  trackBySalonId(index: number, salon: any): string {
    return salon._id; // Replace 'id' with the unique identifier of your salon object
  }
}
