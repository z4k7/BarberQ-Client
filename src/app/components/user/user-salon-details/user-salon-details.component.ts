import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISalon } from 'src/app/models/salon';
import { UserService } from 'src/app/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-user-salon-details',
  templateUrl: './user-salon-details.component.html',
  styleUrls: ['./user-salon-details.component.css'],
})
export class UserSalonDetailsComponent implements OnInit {
  checked: boolean = false;
  salon: ISalon | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    initFlowbite();

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params['salonId']) {
          this.fetchSalonDetails(params['salonId']);
        }
      });
  }

  fetchSalonDetails(salonId: string): void {
    this.userService
      .getSalonDetails(salonId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((salon) => {
        console.log(`salon response`, salon);
        this.salon = salon.data.salonData;
        console.log(`Salon details`, this.salon);
      });
  }

  bookChair(salon: ISalon): void {
    this.router.navigate(['/user/salons/book-a-chair'], {
      queryParams: { salonId: salon._id },
    });
  }

  openAccord(event: MouseEvent, accordionId: string) {
    const accordionElement = document.getElementById(
      accordionId
    ) as HTMLInputElement;
    if (accordionElement) {
      accordionElement.checked = !accordionElement.checked;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
