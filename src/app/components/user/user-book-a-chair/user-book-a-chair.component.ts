import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ISalon } from 'src/app/models/salon';
import { SalonService } from 'src/app/services/salon.service';
import { Store } from '@ngrx/store';
import { IUser } from 'src/app/models/user';
import { selectUserDetails } from 'src/app/state/user-store/user.selector';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/app/services/payment.service';
import { initFlowbite } from 'flowbite';

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
  availableSlots: string[] = [];
  selectedSlot!: string;

  currentFilter: 'Face Treatment' | 'Hair Treatment' | 'all' = 'all';
  filteredServices: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private salonService: SalonService,
    private store: Store,
    private toastr: ToastrService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    initFlowbite();

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
        this.selectedSalonId = this.salon?._id;
        this.filteredServices = this.salon?.services;
      });
  }

  filterServices(filter: 'Face Treatment' | 'Hair Treatment' | 'all'): void {
    this.currentFilter = filter;
    this.filteredServices = this.salon?.services.filter(
      (service: any) =>
        service.category === this.currentFilter || this.currentFilter === 'all'
    );
  }

  toggleService(serviceId: string): void {
    const index = this.selectedServices.indexOf(serviceId);
    if (index > -1) {
      this.selectedServices.splice(index, 1);
    } else {
      this.selectedServices.push(serviceId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.userSubscription.unsubscribe();
  }

  getAvailableSlots(selectedDate: string) {
    const selectedDateObj = new Date(selectedDate);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDateObj < currentDate) {
      this.toastr.warning(
        "Sorry! We can't go back in time, Please select a new date",
        'Time Travel Unavailable!'
      );
      return;
    }

    if (this.selectedServices.length === 0) {
      this.toastr.warning('Please select atleast one service.', 'Warning!');
      return;
    }

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

  calculateTotalAmount(): number {
    let totalAmount = 0;

    this.selectedServices.forEach((serviceId) => {
      const service = this.filteredServices.find((s) => s._id === serviceId);

      if (service) {
        totalAmount += service.price;
      }
    });

    return totalAmount;
  }

  bookSlot() {
    if (this.selectedSlot) {
      const totalAmount = this.calculateTotalAmount();

      this.salonService.createPaymentOrder(totalAmount).subscribe({
        next: (response) => {
          console.log(`Response in next`, response);
          const paymentOptions = {
            key: 'rzp_test_EJWa8kbghrVZQl',
            amount: response.order.amount,
            currency: 'INR',
            name: this.salon?.salonName,
            description: 'Service Booking',
            image: '../../../assets/final logo.jpg',
            order_id: response.order.id, // Add the order ID received from the backend
            prefill: {
              name: this.userData.name,
              email: this.userData.email,
              contact: this.userData.mobile,
            },
            notes: {
              address: this.salon?.locality,
            },
            theme: {
              color: '#123456',
            },
            handler: (response: any) => {
              this.verifyPayment(response);
            },
          };
          this.paymentService.openPaymentModal(paymentOptions);
        },
        error: (error) => {
          this.toastr.error(error, 'Error creating payment order!');
          console.error('Error creating payment order', error);
        },
      });
    }
  }

  verifyPayment(response: any) {
    console.log(`Response passed into Verify Payment:`, response);
    const paymentId = response.razorpay_payment_id;
    this.salonService.verifyPayment(response).subscribe({
      next: (response) => {
        this.toastr.success(
          'Payment Verified Successfully',
          'Verification Success!'
        );
        console.log(`Response from verify payment:`, response);
        this.bookSlotInBackend(paymentId);
      },
      error: (error) => {
        console.error('Error verifying Payment', error);
      },
    });
  }

  bookSlotInBackend(paymentId: string) {
    this.salonService
      .bookSlot(
        this.selectedSalonId!,
        this.userData._id,
        paymentId,
        this.selectedServices,
        this.selectedDate,
        this.selectedSlot
      )
      .subscribe({
        next: (booking) => {
          this.toastr.success(
            'Slot Booked Successfully',
            'Booking Successfull!'
          );
          console.log(`Booking Successfull:`, booking);
          this.availableSlots = [];
        },
        error: (error) => {
          this.toastr.error(error, 'Error!');
          console.error('Error booking slot', error);
        },
      });
  }

  // bookSlot() {
  //   if (this.selectedSlot) {
  //           const totalAmount = this.calculateTotalAmount();

  //     const paymentOptions = {
  //       key: 'rzp_test_EJWa8kbghrVZQl',
  //       amount: totalAmount * 100,
  //       currency: 'INR',
  //       name: 'Your Salon Name',
  //       description: 'Service Booking',
  //       image: '../../../assets/final logo.jpg',
  //       prefill: {
  //         name: this.userData.name,
  //         email: this.userData.email,
  //         contact: this.userData.mobile,
  //       },
  //       notes: {
  //         address: this.salon?.locality,
  //       },
  //       theme: {
  //         color: '#123456',
  //       },
  //     };

  //     this.paymentService.paymentSuccess.subscribe((response) => {
  //       this.salonService
  //         .bookSlot(
  //           this.selectedSalonId!,
  //           this.userData._id,
  //           this.selectedServices,
  //           this.selectedDate,
  //           this.selectedSlot
  //         )
  //         .subscribe({
  //           next: (booking) => {
  //             this.toastr.success(
  //               'Slot Booked Successfully',
  //               'Booking Successfull!'
  //             );
  //             console.log(`Booking Successfull`, booking);
  //             this.availableSlots = [];
  //           },
  //           error: (error) => {
  //             this.toastr.error(error, 'Error!');
  //           },
  //         });
  //     });

  //     this.paymentService.openPaymentModal(paymentOptions);
  //   }
  // }
}
