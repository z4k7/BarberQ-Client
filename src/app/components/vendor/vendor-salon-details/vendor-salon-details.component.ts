import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ISalon } from 'src/app/models/salon';
import { IService } from 'src/app/models/service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-vendor-salon-details',
  templateUrl: './vendor-salon-details.component.html',
  styleUrls: ['./vendor-salon-details.component.css'],
})
export class VendorSalonDetailsComponent implements OnInit {
  salon!: ISalon;
  categories: string[] = ['Face Treatment', 'Hair Treatment'];
  services: IService[] = [];
  filteredServices: IService[] = [];
  selectedCategory: string = '';
  selectedService: IService | null = null;
  selectedServicePrice: number = 0;
  selectedServiceDuration: number = 0;
  selectedServices: IService[] = [];

  selectedServicesToDelete: IService[] = [];

  constructor(
    private route: ActivatedRoute,
    private vendorService: VendorService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getSalonDetails();
  }

  getSalonDetails(): void {
    const salonId = this.route.snapshot.paramMap.get('id');
    if (salonId) {
      this.vendorService.getSalonById(salonId).subscribe((salon) => {
        this.salon = salon.data.salonData;
        this.services = this.salon.services;
      });
    }
  }

  toggleAccordion(index: number): void {
    const radioButtonId = `my-accordion-${index}`;
    const radioButton = document.getElementById(
      radioButtonId
    ) as HTMLInputElement;
    if (radioButton) {
      radioButton.checked = true;
    }
  }

  openEditServiceModal(): void {
    const modal = document.getElementById('edit-service') as HTMLDivElement;
    const backdrop = document.getElementById('modal-backdrop');

    if (modal) {
      modal.classList.remove('hidden');
      backdrop?.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  openDeleteServiceModal(): void {
    const modal = document.getElementById('delete-service') as HTMLDivElement;
    const backdrop = document.getElementById('modal-backdrop');

    if (modal) {
      modal.classList.remove('hidden');
      backdrop?.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  closeDeleteServiceModal(): void {
    const modal = document.getElementById('delete-service') as HTMLDivElement;
    const backdrop = document.getElementById('modal-backdrop');

    if (modal) {
      modal.classList.add('hidden');
      backdrop?.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  closeEditServiceModal(): void {
    const modal = document.getElementById('edit-service') as HTMLDivElement;
    const backdrop = document.getElementById('modal-backdrop');

    if (modal) {
      modal.classList.add('hidden');
      backdrop?.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  filterServicesByCategory(): void {
    this.filteredServices = this.services.filter(
      (service) => service.category === this.selectedCategory
    );
    this.selectedService = null;
  }

  setSelectedService(service: IService): void {
    this.selectedService = { ...service };
    this.selectedServicePrice = service.price;
    this.selectedServiceDuration = service.duration;
  }

  updateService(): void {
    if (this.selectedService) {
      this.selectedService.price = this.selectedServicePrice;
      this.selectedService.duration = this.selectedServiceDuration;
      this.selectedServices.push(this.selectedService);
      this.selectedService = null;
      this.selectedServicePrice = 0;
      this.selectedServiceDuration = 0;
    }
  }

  removeSelectedService(service: IService): void {
    this.selectedServices = this.selectedServices.filter(
      (s) => s._id !== service._id
    );
  }

  confirmEdits(): void {
    if (this.selectedServices.length > 0) {
      this.vendorService
        .editSalonServices(this.salon._id, this.selectedServices)
        .subscribe((response) => {
          this.toastr.success('Services Updated Successfully', 'Success');
          this.selectedServices = [];
          this.closeEditServiceModal();
        });
    } else {
      this.toastr.warning('No services selected for update', 'Warning!');
    }
  }

  selectedServiceForDeletion(service: IService): void {
    this.selectedServicesToDelete.push(service);
  }

  removeServiceFromDeletionList(service: IService): void {
    this.selectedServicesToDelete = this.selectedServicesToDelete.filter(
      (s) => s._id !== service._id
    );
  }

  confirmDeletion(): void {
    if (this.selectedServicesToDelete.length > 0) {
      this.vendorService
        .deleteSalonServices(this.salon._id, this.selectedServicesToDelete)
        .subscribe((response) => {
          this.toastr.success('Services Deleted Successfully', 'Success');
          this.selectedServicesToDelete = [];
          this.closeDeleteServiceModal();
        });
    } else {
      this.toastr.warning('No services selected for deletion', 'Warning!');
    }
  }
}
