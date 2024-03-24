import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ISalon } from 'src/app/models/salon';
import { SalonService } from 'src/app/services/salon.service';
import { Store } from '@ngrx/store';
import { IUser } from 'src/app/models/user';
import { selectUserDetails } from 'src/app/state/user-store/user.selector';

@Component({
  selector: 'app-user-book-a-chair',
  templateUrl: './user-book-a-chair.component.html',
  styleUrls: ['./user-book-a-chair.component.css'],
})
export class UserBookAChairComponent implements OnInit, OnDestroy {
  salon: ISalon | null = null;
  private destroy$ = new Subject<void>();

  userState$ = this.store.select(selectUserDetails);
  userData!: IUser;
  userSubscription!: Subscription;

  selectedSalonId: string | undefined;
  selectedServices: string[] = [];
  selectedDate: string = '';
  availableSlots: { time: string; chair: number }[] = [];
  selectedSlot: { time: string; chair: number } | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private salonService: SalonService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.userState$.subscribe((user) => {
      if (user) this.userData = user;
    });

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
        console.log(`Salons`, this.salon);
        this.selectedSalonId = this.salon?._id;
        this.selectedServices = this.salon?.services.map(
          (service: any) => service._id
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.userSubscription.unsubscribe();
  }

  getAvailableSlots(selectedDate: string) {
    console.log('Received date in getAvailableSlots:', selectedDate);

    this.selectedDate = selectedDate;
    console.log(`Selected date`, this.selectedDate);

    this.salonService
      .getAvailableSlots(
        this.selectedSalonId!,
        this.selectedServices,
        this.selectedDate
      )
      .subscribe((slots) => {
        console.log(`Slots`, slots);
        this.availableSlots = slots;
      });
  }

  bookSlot() {
    if (this.selectedSlot) {
      this.salonService
        .bookSlot(
          this.selectedSalonId!,
          this.userData._id,
          this.selectedServices,
          this.selectedDate,
          this.selectedSlot.time
        )
        .subscribe((booking) => {
          console.log(`Booking Successfull`, booking);
        });
    }
  }
}
