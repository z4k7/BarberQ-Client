import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { initFlowbite } from 'flowbite';
import { ISalon } from 'src/app/models/salon';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

interface IFilters {
  facilities: string[];
}
@Component({
  selector: 'app-user-salons',
  templateUrl: './user-salons.component.html',
  styleUrls: ['./user-salons.component.css'],
})
export class UserSalonsComponent implements OnInit {
  Salons: ISalon[] = [];
  searchQuery: string = '';
  searchForm!: FormGroup;
  currentPage = 1;
  itemsPerPage = 6;
  salonCount = 0;
  filters: IFilters = {
    facilities: [],
  };

  facilities: string[] = ['TV', 'WiFi', 'Parking', 'AC', 'Cards'];
  selectedFacilities: { [key: string]: boolean } = {};

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    initFlowbite();

    setTimeout(() => {
      this.spinner.hide();
    }, 2000);

    this.searchForm = this.fb.group({
      searchQuery: [''],
    });

    this.searchForm
      .get('searchQuery')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.searchQuery = value;
        this.currentPage = 1;
        this.getSalons();
      });

    this.breakpointObserver
      .observe([Breakpoints.XLarge])
      .subscribe((result) => {
        if (result.matches) {
          this.itemsPerPage = 8;
        } else {
          this.itemsPerPage = 6;
        }
      });
    this.getSalons();
  }

  checkbox(event: Event): void {
    const target = event.target as HTMLInputElement;
    const facility = target.value;
    this.selectedFacilities[facility] = target.checked;
    this.applyFilters();
  }

  handleClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  getSalons(): void {
    this.userService
      .getSalons(this.currentPage, this.itemsPerPage, this.searchQuery)
      .subscribe({
        next: (res) => {
          if (res.data !== null) {
            this.Salons = res.data?.salonData.salons;
            console.log(`Salons`, this.Salons);
            this.salonCount = res.data?.salonData.salonCount;
          }
        },
      });
  }

  totalPages(): number[] {
    return Array(Math.ceil(this.salonCount / this.itemsPerPage))
      .fill(0)
      .map((x, i) => i + 1);
  }

  applyFilters(): void {
    console.log(`Filter Applied`);
    const selectedFacilitiesArray = Object.keys(this.selectedFacilities).filter(
      (facility) => this.selectedFacilities[facility]
    );
    this.filters.facilities = selectedFacilitiesArray;
    this.getSalons();
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
    console.log('Current Page:', this.currentPage);
    this.getSalons();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages().length) {
      this.currentPage++;
      this.getSalons();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getSalons();
    }
  }

  onLogout(): void {
    localStorage.removeItem('userJwtAccess');
    localStorage.removeItem('userJwtRefresh');
    this.router.navigate(['/user']);
  }

  bookChair(salon: ISalon): void {
    this.router.navigate(['/user/salons/book-a-chair'], {
      queryParams: { salon: JSON.stringify(salon) },
    });
  }

  viewSalonDetails(salon: ISalon): void {
    this.router.navigate(['/user/salons/salon-details'], {
      queryParams: { salon: JSON.stringify(salon) },
    });
  }
  trackBySalonId(index: number, salon: ISalon): string {
    return salon._id;
  }
}
