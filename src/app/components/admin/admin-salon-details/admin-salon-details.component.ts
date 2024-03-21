import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ISalon } from 'src/app/models/salon';
import { IService } from 'src/app/models/service';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-salon-details',
  templateUrl: './admin-salon-details.component.html',
  styleUrls: ['./admin-salon-details.component.css'],
})
export class AdminSalonDetailsComponent implements OnInit {
  salon!: ISalon;
  services: IService[] = [];

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getSalonDetails();
  }

  getSalonDetails(): void {
    const salonId = this.route.snapshot.paramMap.get('id');

    if (salonId) {
      this.adminService.getSalonById(salonId).subscribe((salon) => {
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

  approveSalon(): void {
    this.updateSalonStatus('approved');
  }

  rejectSalon(): void {
    this.updateSalonStatus('rejected');
  }

  disapproveSalon(): void {
    this.updateSalonStatus('disapproved');
  }

  updateSalonStatus(status: string): void {
    if (this.salon) {
      this.salon.status = status;
      this.adminService
        .updateSalonStatus(this.salon._id, status)
        .subscribe((response) => {
          const updatedStatus = response.data.salonData.updatedStatus;
          if (updatedStatus == 'approved') {
            this.toastr.success('Salon Approved Successfully', 'Approved!');
          } else if (updatedStatus == 'rejected') {
            this.toastr.warning('Salon Rejected Successfully', 'Rejected!');
          } else if (updatedStatus == 'disapproved') {
            this.toastr.warning('Salon Rejected Successfully', 'Disapproved!');
          }
        });
    }
  }
}
