import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IService } from 'src/app/models/service';
import { AdminService } from 'src/app/services/admin-service.service';
import { initFlowbite } from 'flowbite';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-services',
  templateUrl: './admin-services.component.html',
  styleUrls: ['./admin-services.component.css'],
})
export class AdminServicesComponent implements OnInit {
  Services: IService[] = [];
  form!: FormGroup;
  backendURL = environment.baseURL;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.adminService.getServices().subscribe((services) => {
      this.Services = services?.data?.serviceData;
      initFlowbite();
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

  saveChanges(service: IService, index: number): void {
    const update = this.form.getRawValue();
    update._id = service._id;

    this.adminService.editService(update).subscribe({
      next: (res) => {
        this.Services[index].serviceName = res.data.serviceName;
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

  openEditModal(service: any) {
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

  closeEditModal(service: any) {
    const modal = document.getElementById(
      `crud-modal-edit-${service._id}`
    ) as HTMLDivElement;
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }
  openHideModal(service: any) {
    const modal = document.getElementById(
      `hide-modal-${service._id}`
    ) as HTMLDivElement;
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  closeHideModal(service: any) {
    const modal = document.getElementById(
      `hide-modal-${service._id}`
    ) as HTMLDivElement;
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  onAction(visible: boolean, index: number, id: string) {
    if (visible) {
      this.Services[index].isVisible = false;
      this.adminService.hideService(id).subscribe((data) => {
        this.toastr.warning(`${this.Services[index].serviceName} is Hidden`);
        this.closeHideModal(this.Services[index]);
      });
    } else {
      this.Services[index].isVisible = true;
      this.adminService.hideService(id).subscribe((data) => {
        this.toastr.warning(`${this.Services[index].serviceName} is Visible`);
        this.closeHideModal(this.Services[index]);
      });
    }
  }
}
