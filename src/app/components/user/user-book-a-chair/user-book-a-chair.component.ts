import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { ISalon } from 'src/app/models/salon';

@Component({
  selector: 'app-user-book-a-chair',
  templateUrl: './user-book-a-chair.component.html',
  styleUrls: ['./user-book-a-chair.component.css'],
})
export class UserBookAChairComponent implements OnInit, OnDestroy {
  salon: ISalon | null = null;
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
        this.salon = salon.data.salonData;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
