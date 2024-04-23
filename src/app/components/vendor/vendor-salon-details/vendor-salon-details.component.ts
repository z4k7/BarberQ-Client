import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ISalon } from 'src/app/models/salon';
import { IService } from 'src/app/models/service';
import { VendorService } from 'src/app/services/vendor.service';
import { PaymentService } from 'src/app/services/payment.service';
import { Store } from '@ngrx/store';
import { selectVendorDetails } from 'src/app/state/vendor-store/vendor.selector';
import { IVendor } from 'src/app/models/vendor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vendor-salon-details',
  templateUrl: './vendor-salon-details.component.html',
  styleUrls: ['./vendor-salon-details.component.css'],
})
export class VendorSalonDetailsComponent implements OnInit, OnDestroy {
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

  vendorState$ = this.store.select(selectVendorDetails);
  vendorData!: IVendor;
  vendorSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private vendorService: VendorService,
    private toastr: ToastrService,
    private paymentService: PaymentService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.vendorSubscription = this.vendorState$.subscribe((vendor) => {
      if (vendor) this.vendorData = vendor;
    });

    this.getSalonDetails();
  }

  ngOnDestroy(): void {
    this.vendorSubscription.unsubscribe();
  }

  getPremium() {
    this.vendorService.createPaymentOrder(2999).subscribe({
      next: (response) => {
        if (response.premium == 'premium') {
          console.log(`Inside premium response`);
          this.upgradeToPremium();
        }

        const paymentOptions = {
          key: 'rzp_test_EJWa8kbghrVZQl',
          amount: response.order.amount,
          currency: 'INR',
          name: 'BarberQ',
          description: 'Premium Subscription ',
          image: '../../../assets/final logo.jpg',
          order_id: response.order.id,
          prefill: {
            name: this.vendorData.name,
            email: this.vendorData.email,
            contact: this.vendorData.mobile,
          },
          notes: {
            address: this.salon.locality,
          },
          theme: {
            color: '#123456',
          },
          handler: (response: any) => {
            console.log(`Response inside makePayment handler`, response);

            this.verifyPayment(response);
          },
        };
        this.paymentService.openPaymentModal(paymentOptions);
      },
      error: (error) => {
        console.error('Error creating payment order', error);
      },
    });
  }

  makePayment() {
    this.vendorService.createPaymentOrder(2000).subscribe({
      next: (response) => {
        const paymentOptions = {
          key: 'rzp_test_EJWa8kbghrVZQl',
          amount: response.order.amount,
          currency: 'INR',
          name: 'BarberQ',
          description: 'Salon Activation Fee',
          image: '../../../assets/final logo.jpg',
          order_id: response.order.id,
          prefill: {
            name: this.vendorData.name,
            email: this.vendorData.email,
            contact: this.vendorData.mobile,
          },
          notes: {
            address: this.salon.locality,
          },
          theme: {
            color: '#123456',
          },
          handler: (response: any) => {
            console.log(`Response inside makePayment handler`, response);

            this.verifyPayment(response);
          },
        };
        this.paymentService.openPaymentModal(paymentOptions);
      },
      error: (error) => {
        console.error('Error creating payment order', error);
      },
    });
  }

  verifyPayment(response: any) {
    console.log(`Verify payment inside vendor salon details called`);

    this.vendorService.verifyPayment(response).subscribe({
      next: (response) => {
        console.log(`Rsponse`, response);
        this.updateSalonStatus();
      },
      error: (error) => {
        this.toastr.error(error.message, 'Error!');
      },
    });
  }

  upgradeToPremium() {
    this.vendorService.upgradeToPremium(this.salon._id).subscribe({
      next: (response) => {
        this.toastr.success(
          'You Have Successfully Upgraded To Premium!!',
          'Congratulations!'
        );
        console.log('Response in update Salon', response);
        this.getSalonDetails();
      },
      error: (error) => {
        console.log(`Error in update salon`, error);
        this.toastr.error('Failed to activate salon', 'Error');
      },
    });
  }

  updateSalonStatus() {
    this.vendorService.updateSalonStatus(this.salon._id, 'active').subscribe({
      next: (response) => {
        this.toastr.success('Salon activated successfully', 'Success!');
        console.log('Response in update Salon', response);
        this.getSalonDetails();
      },
      error: (error) => {
        console.log(`Error in update salon`, error);
        this.toastr.error('Failed to activate salon', 'Error');
      },
    });
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
          this.getSalonDetails();
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
          console.log(`Response in confirm delete`, response);
          this.toastr.success('Services Deleted Successfully', 'Success');
          this.selectedServicesToDelete = [];
          this.getSalonDetails();
          this.closeDeleteServiceModal();
        });
    } else {
      this.toastr.warning('No services selected for deletion', 'Warning!');
    }
  }
}
