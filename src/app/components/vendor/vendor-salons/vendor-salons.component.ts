import { Component, OnDestroy, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { VendorService } from 'src/app/services/vendor.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { ISalon } from 'src/app/models/salon';
import { Store } from '@ngrx/store';
import { selectVendorDetails } from 'src/app/state/vendor-store/vendor.selector';
import { IVendor } from 'src/app/models/vendor';
import { IService } from 'src/app/models/service';

@Component({
  selector: 'app-vendor-salons',
  templateUrl: './vendor-salons.component.html',
  styleUrls: ['./vendor-salons.component.css'],
})
export class VendorSalonsComponent implements OnInit, OnDestroy {
  Salons: ISalon[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchQuery: string = '';
  salonCount = 0;
  searchForm!: FormGroup;
  selectedCategory: string = 'All';

  selectedSalon: ISalon | null = null;

  Services: IService[] = [];
  filteredServices: IService[] = [];

  selectedServices: IService[] = [];

  vendorData!: IVendor;
  vendorSubscription!: Subscription;
  vendorState$ = this.store.select(selectVendorDetails);

  constructor(
    private vendorService: VendorService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private store: Store
  ) {}

  ngOnInit(): void {
    initFlowbite();

    this.vendorSubscription = this.vendorState$.subscribe((vendor) => {
      if (vendor) this.vendorData = vendor;
    });

    this.getSalons();
    this.getAllServices();

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
  }

  ngOnDestroy(): void {
    this.vendorSubscription.unsubscribe();
  }

  getSalons(): void {
    this.vendorService
      .getSalons(
        this.currentPage,
        this.itemsPerPage,
        this.vendorData._id,
        this.searchQuery
      )
      .subscribe({
        next: (res) => {
          if (res.data !== null) {
            console.log(res, 'res');

            this.Salons = res.data.salonData.salons;
            this.salonCount = res.data.salonData.salonCount;
          }
        },
      });
  }

  getAllServices(): void {
    this.vendorService.getAllServices().subscribe({
      next: (res) => {
        if (res.data) {
          this.Services = res.data.serviceData;
          this.filteredServices = [...this.Services];
          console.log(`Services:`, this.Services);
        }
      },
    });
  }

  addService(): void {
    const selectedServiceName = (
      document.getElementById('name') as HTMLSelectElement
    ).value;
    const selectedServicePrice = (
      document.getElementById('price') as HTMLSelectElement
    ).value;
    const selectedServiceDuration = (
      document.getElementById('duration') as HTMLSelectElement
    ).value;

    const selectedService = this.Services.find(
      (service) => service.serviceName === selectedServiceName
    );

    if (selectedService) {
      const updatedService = {
        ...selectedService,
        price: Number(selectedServicePrice),
        duration: Number(selectedServiceDuration),
      };

      const serviceExists = this.selectedServices.some(
        (service) => service.serviceName === updatedService.serviceName
      );

      if (!serviceExists) {
        this.selectedServices.push(updatedService);
      } else {
        this.toastr.error('Service already added', 'Error');
      }
    }
  }

  removeService(service: IService): void {
    this.selectedServices = this.selectedServices.filter((s) => s !== service);
  }

  saveServices(form: NgForm): void {
    if (this.selectedSalon) {
      this.vendorService
        .updateSalonServices(this.selectedSalon._id, this.selectedServices)
        .subscribe((response) => {
          console.log('Services updated successfully');
          this.toastr.success('Services updated successfully', 'Success');
          form.resetForm();
          this.selectedServices = [];
          this.closeAddModal();
        });
    }
  }

  categoryChange(event: any): void {
    this.selectedCategory = event.target.value;
    this.filterServicesByCategory();
  }

  filterServicesByCategory(): void {
    if (this.selectedCategory === 'All') {
      this.filteredServices = [...this.Services];
    } else {
      this.filteredServices = this.Services.filter(
        (service) => service.category === this.selectedCategory
      );
    }
  }

  setItemsPerPage(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.getSalons();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getSalons();
  }

  getLastItemIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.salonCount);
  }

  get totalPages(): number[] {
    return Array.from(
      {
        length: Math.ceil(this.salonCount / this.itemsPerPage),
      },
      (_, i) => i + 1
    );
  }

  openAddModal(salon: ISalon): void {
    this.selectedSalon = salon;
    const modal = document.getElementById('add-service') as HTMLDivElement;
    const backdrop = document.getElementById('modal-backdrop');

    if (modal) {
      modal.classList.remove('hidden');
      backdrop?.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  closeAddModal(): void {
    const modal = document.getElementById('add-service') as HTMLDivElement;
    const backdrop = document.getElementById('modal-backdrop');

    if (modal) {
      modal.classList.add('hidden');
      backdrop?.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }
}
