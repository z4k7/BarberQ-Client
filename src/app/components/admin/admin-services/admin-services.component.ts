import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IService } from 'src/app/models/service';
import { AdminService } from 'src/app/services/admin.service';
import { initFlowbite } from 'flowbite';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-admin-services',
  templateUrl: './admin-services.component.html',
  styleUrls: ['./admin-services.component.css'],
})
export class AdminServicesComponent implements OnInit {
  Services: IService[] = [];
  allServices: IService[] = [];
  form!: FormGroup;
  currentPage = 1;
  itemsPerPage = 10;
  searchQuery: string = '';
  serviceCount = 0;
  searchForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    initFlowbite();
    this.getServices();

    this.searchForm = this.fb.group({
      searchQuery: [''],
    });

    this.searchForm
      .get('searchQuery')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.searchQuery = value;
        this.currentPage = 1;
        this.getServices();
      });

    this.form = this.formBuilder.group({
      serviceName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('[a-zA-Z].*'),
        ],
      ],
      duration: [
        '',
        [
          Validators.required,
          Validators.maxLength(2),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      category: ['', Validators.required],
    });
  }

  getServices(): void {
    this.adminService
      .getServices(this.currentPage, this.itemsPerPage, this.searchQuery)
      .subscribe({
        next: (res) => {
          if (res.data !== null) {
            console.log(`response`, res);
            this.Services = res.data.serviceData.services;
            this.allServices = res.data.serviceData.services;
            this.serviceCount = res.data.serviceData.serviceCount;
          }
        },
      });
  }

  setItemsPerPage(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.getServices();
  }

  setFilter(filterOption: string): void {
    if (filterOption === 'all') {
      this.Services = this.allServices;
    } else if (filterOption === 'face') {
      this.Services = this.allServices.filter(
        (service) => service.category == 'Face Treatment'
      );
    } else if (filterOption === 'hair') {
      this.Services = this.allServices.filter(
        (service) => service.category == 'Hair Treatment'
      );
    }
    this.itemsPerPage = this.Services.length;
    this.currentPage = 1;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getServices();
  }

  getLastItemIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.serviceCount);
  }

  get totalPages(): number[] {
    return Array.from(
      { length: Math.ceil(this.serviceCount / this.itemsPerPage) },
      (_, i) => i + 1
    );
  }

  saveChanges(service: IService, index: number): void {
    const update = this.form.getRawValue();
    update._id = service._id;

    this.adminService.editService(update).subscribe({
      next: (res) => {
        console.log(`response after edit`, res);
        this.Services[index].serviceName = res.data.serviceName;
        this.toastr.success(res.message);
      },
    });

    this.closeEditModal(service);
  }

  addService() {
    const service = this.form.getRawValue();
    console.log(service);
    this.adminService.addService(service).subscribe({
      next: (res) => {
        this.Services.push(res.data.data);
        this.toastr.warning(res.message);
        this.closeAddModal();
      },
      error: (err) => {
        this.toastr.warning(err.error.message);
        this.closeAddModal();
      },
    });
  }

  openAddModal() {
    const modal = document.getElementById(`crud-modal-add`) as HTMLDivElement;

    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  closeAddModal() {
    const modal = document.getElementById(`crud-modal-add`) as HTMLDivElement;

    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  openEditModal(service: IService) {
    const modal = document.getElementById(
      `crud-modal-edit-${service._id}`
    ) as HTMLDivElement;

    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      this.form.get('serviceName')?.setValue(service.serviceName);
      this.form.get('category')?.setValue(service.category);
    }
  }

  closeEditModal(service: IService) {
    const modal = document.getElementById(
      `crud-modal-edit-${service._id}`
    ) as HTMLDivElement;
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }
  openHideModal(service: IService) {
    const modal = document.getElementById(
      `hide-modal-${service._id}`
    ) as HTMLDivElement;
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  closeHideModal(service: IService) {
    const modal = document.getElementById(
      `hide-modal-${service._id}`
    ) as HTMLDivElement;
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  onAction(visible: boolean, index: number, id: string) {
    this.Services[index].isVisible = !visible;
    this.adminService.hideService(id).subscribe(() => {
      this.toastr.warning(
        `${this.Services[index].serviceName} is ${
          visible ? 'Hidden' : 'Visible'
        }`
      );
      this.closeHideModal(this.Services[index]);
    });
  }
}
