import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SalonService } from 'src/app/services/salon.service';

@Component({
  selector: 'app-vendor-salon-bookings',
  templateUrl: './vendor-salon-bookings.component.html',
  styleUrls: ['./vendor-salon-bookings.component.css'],
})
export class VendorSalonBookingsComponent implements OnInit {
  Bookings: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchQuery: string = '';
  bookingsCount = 0;
  searchForm!: FormGroup;
  limitOpen: boolean = false;

  selectedBooking: any | null = null;

  constructor(
    private salonService: SalonService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    initFlowbite();

    this.getSalonBookings();

    this.searchForm = this.fb.group({
      searchQuery: [''],
    });
    this.searchForm
      .get('searchQuery')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.searchQuery = value;
        this.currentPage = 1;
        this.getSalonBookings();
      });
  }

  getSalonBookings(): void {
    const salonId = this.route.snapshot.paramMap.get('id');

    console.log('salonId:', salonId);
    if (salonId) {
      this.salonService
        .getSalonBookings(
          this.currentPage,
          this.itemsPerPage,
          salonId,
          this.searchQuery
        )
        .subscribe({
          next: (res) => {
            if (res.data !== null) {
              this.Bookings = res.data.bookingData.bookings;
              console.log(`Bookings `, this.Bookings);
              this.bookingsCount = res.data.bookingData.bookingsCount;
            }
          },
        });
    }
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
    this.getSalonBookings();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getSalonBookings();
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
    const backdrop = document.getElementById('backdrop');

    if (modal) {
      modal.classList.remove('hidden');
      backdrop?.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  closeDetailsModal(): void {
    const modal = document.getElementById('detailsModal') as HTMLDivElement;
    const backdrop = document.getElementById('backdrop');

    if (modal) {
      modal.classList.add('hidden');
      backdrop?.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }
}
