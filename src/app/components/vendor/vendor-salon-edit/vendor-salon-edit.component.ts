import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ISalon } from 'src/app/models/salon';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-vendor-salon-edit',
  templateUrl: './vendor-salon-edit.component.html',
  styleUrls: ['./vendor-salon-edit.component.css'],
})
export class VendorSalonEditComponent implements OnInit {
  salon!: ISalon;
  facilities: string[] = [];
  facilityOptions = ['wifi', 'parking', 'ac', 'cards', 'tv'];
  salonForm!: FormGroup;

  constructor(
    private vendorService: VendorService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getSalonDetails();
    this.createForm();
  }

  getSalonDetails(): void {
    const salonId = this.route.snapshot.paramMap.get('id');
    if (salonId) {
      this.vendorService.getSalonById(salonId).subscribe((salon) => {
        this.salon = salon.data.salonData;
        console.log('Salon Details', this.salon);
        this.facilities = this.salon.facilities;
        this.populateForm();
      });
    }
  }

  createForm(): void {
    this.salonForm = this.fb.group({
      salonName: '',
      contactNumber: '',
      chairCount: '',
      openingTime: '',
      closingTime: '',
    });
  }

  populateForm(): void {
    this.salonForm.patchValue({
      salonName: this.salon.salonName,
      contactNumber: this.salon.contactNumber,
      chairCount: this.salon.chairCount,
      openingTime: this.salon.openingTime,
      closingTime: this.salon.closingTime,
    });
  }

  toggleFacility(facility: string, event: any): void {
    if (event.target.checked) {
      this.facilities.push(facility);
    } else {
      this.facilities = this.facilities.filter((f) => f !== facility);
    }
  }

  updateSalon(): void {
    const updatedSalonDetails = {
      ...this.salonForm.value,
      facilities: this.facilities,
    };

    const salonId = this.route.snapshot.paramMap.get('id');

    if (salonId) {
      this.vendorService
        .updateSalon(salonId, updatedSalonDetails)
        .subscribe((response) => {
          this.toastr.success('Salon updated successfully', 'Success!');
          this.router.navigate(['/vendor/salon-details', salonId]);
        });
    }
  }
}
