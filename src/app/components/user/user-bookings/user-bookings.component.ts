import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { initFlowbite } from 'flowbite';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { IUser } from 'src/app/models/user';
import { SalonService } from 'src/app/services/salon.service';
import { selectUserDetails } from 'src/app/state/user-store/user.selector';

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.component.html',
  styleUrls: ['./user-bookings.component.css'],
})
export class UserBookingsComponent implements OnInit, OnDestroy {
  Bookings: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchQuery: string = '';
  bookingsCount = 0;
  searchForm!: FormGroup;
  limitOpen: boolean = false;

  selectedBooking: any | null = null;

  userState$ = this.store.select(selectUserDetails);
  userData!: IUser;
  userSubscription!: Subscription;

  constructor(
    private salonService: SalonService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private store: Store
  ) {}

  ngOnInit(): void {
    initFlowbite();
    this.userSubscription = this.userState$.subscribe((user) => {
      if (user) this.userData = user;
    });
    this.getUserBookings();

    this.searchForm = this.fb.group({
      searchQuery: [''],
    });
    this.searchForm
      .get('searchQuery')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.searchQuery = value;
        this.currentPage = 1;
        this.getUserBookings();
      });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  getUserBookings(): void {
    const userId = this.userData._id;
    this.salonService
      .getUserBookings(
        this.currentPage,
        this.itemsPerPage,
        userId,
        this.searchQuery
      )
      .subscribe({
        next: (res) => {
          console.log(`Response`, res);
          if (res.data !== null) {
            this.Bookings = res.data.bookingData.bookings;
            this.bookingsCount = res.data.bookingData.bookingsCount;
          }
        },
      });
  }

  toggleLimit() {
    this.limitOpen = !this.limitOpen;
  }

  closeLimit() {
    this.limitOpen = false;
  }
  setItemsPerPage(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.getUserBookings();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getUserBookings();
  }

  getLastItemIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.bookingsCount);
  }

  get totalPages(): number[] {
    return Array.from(
      {
        length: Math.ceil(this.bookingsCount / this.itemsPerPage),
      },
      (_, i) => i + 1
    );
  }

  openDetailsModal(booking: any): void {
    this.selectedBooking = booking;
    const modal = document.getElementById('detailsModal') as HTMLDivElement;
    const backdrop = document.getElementById('modal-backdrop');

    if (modal) {
      modal.classList.remove('hidden');
      backdrop?.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  closeDetailsModal(): void {
    const modal = document.getElementById('detailsModal') as HTMLDivElement;
    const backdrop = document.getElementById('modal-backdrop');

    if (modal) {
      modal.classList.add('hidden');
      backdrop?.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  cancelBooking(bookingId: string): void {
    console.log(`Booking Id`, bookingId);

    this.salonService.cancelBooking(bookingId).subscribe({
      next: (response) => {
        this.toastr.success('Booking cancelled successfully!', 'Cancelled');
        console.log('Refund Success', response);
        this.getUserBookings();
      },
    });
    this.closeConfirmationModal();
  }

  openConfirmationModal(booking: any): void {
    this.selectedBooking = booking;
    const modal = document.getElementById('confirmModal') as HTMLDivElement;
    const backdrop = document.getElementById('modal-backdrop');

    if (modal) {
      modal.classList.remove('hidden');
      backdrop?.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  closeConfirmationModal(): void {
    const modal = document.getElementById('confirmModal') as HTMLDivElement;
    const backdrop = document.getElementById('modal-backdrop');

    if (modal) {
      modal.classList.add('hidden');
      backdrop?.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }
}
