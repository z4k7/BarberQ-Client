import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISalon } from 'src/app/models/salon';
import { UserService } from 'src/app/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-salon-details',
  templateUrl: './user-salon-details.component.html',
  styleUrls: ['./user-salon-details.component.css'],
})
export class UserSalonDetailsComponent implements OnInit {
  checked: boolean = false;
  salon!: ISalon;
  facilities: string[] = [];
  services: any[] = [];
  serviceIds: string[] = [];
  faceTreatment: string[] = [];
  hairTreatment: string[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params['salon']) {
          this.salon = JSON.parse(params['salon']);
          console.log(this.salon, 'salon from query');

          this.facilities = this.salon.facilities;
          this.serviceIds = this.salon.services;
          console.log(`serviceIDs`, this.serviceIds);
          this.getServices(this.serviceIds);
        }
      });
  }

  getServices(serviceIds: string[]): void {
    this.faceTreatment = [];
    this.hairTreatment = [];

    this.userService
      .getServices(serviceIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        console.log('Response', response);
        this.services = response.services.data;
        console.log('Services', this.services);
      });
  }

  bookChair(salon: ISalon): void {
    this.router.navigate(['/user/salons/book-a-chair'], {
      queryParams: { salon: JSON.stringify(salon) },
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
