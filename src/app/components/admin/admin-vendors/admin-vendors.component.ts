import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AdminService } from 'src/app/services/admin-service.service';
import { IVendor } from 'src/app/models/vendor';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';



@Component({
  selector: 'app-admin-vendors',
  templateUrl: './admin-vendors.component.html',
  styleUrls: ['./admin-vendors.component.css'],
})
export class AdminVendorsComponent implements OnInit {
  Vendors: IVendor[] = [];
  allVendors: IVendor[] = []

  currentPage = 1;
  itemsPerPage = 10;
  searchQuery: string = '';
  vendorCount = 0;
  searchForm!: FormGroup;


  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private fb: FormBuilder

  ) {}

  ngOnInit() {
    initFlowbite();
    this.getVendors();

    this.searchForm = this.fb.group({
      searchQuery: [''],
    });

    this.searchForm
    .get('searchQuery')
    ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
    .subscribe((value) => {
      this.searchQuery = value;
      this.currentPage = 1;
      this.getVendors();
    });

  }
  getVendors(): void {
    this.adminService
      .getVendors(this.currentPage, this.itemsPerPage, this.searchQuery)
      .subscribe({
        next: (res) => {
          if (res.data !== null) {
            this.Vendors = res.data.adminData.vendors;
            this.vendorCount = res.data.adminData.vendorCount;
          }
        },
      });
  }

  setItemsPerPage(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.getVendors();
  }

  setFilter(filterOption: string): void {
    if (filterOption === 'all') {
      this.Vendors = this.allVendors
    } else if (filterOption === 'active') {
      this.Vendors = this.allVendors.filter((vendor) => !vendor.isBlocked);
    } else if (filterOption === 'blocked') {
      this.Vendors = this.allVendors.filter((vendor) => vendor.isBlocked);
    }
    this.itemsPerPage = this.Vendors.length;
    this.currentPage = 1;
  }

  onSearch(): void {
    this.searchQuery = this.searchForm.get('searchQuery')?.value;
    this.currentPage = 1;
    this.getVendors();
  }



  onPageChange(page: number): void {
    this.currentPage = page;
    this.getVendors();
  }

  getLastItemIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.vendorCount);
  }

  get totalPages(): number[] {
    return Array.from(
      { length: Math.ceil(this.vendorCount / this.itemsPerPage) },
      (_, i) => i + 1
    );
  }

  onAction(blocked: boolean, index: number, id: string) {
    if (blocked) {
      this.Vendors[index].isBlocked = false;
      this.adminService.blockUnblockVendor(id).subscribe((data) => {
        this.toastr.warning(`${this.Vendors[index].name} is Unblocked`);
        this.closeBlockModal(this.Vendors[index]);
      });
    } else {
      this.Vendors[index].isBlocked = true;
      this.adminService.blockUnblockVendor(id).subscribe((data) => {
        this.toastr.warning(`${this.Vendors[index].name} is Blocked`);
        this.closeBlockModal(this.Vendors[index]);
      });
    }
  }

  openBlockModal(vendor: any) {
    const modal = document.getElementById(
      `hide-modal-${vendor._id}`
    ) as HTMLDivElement;
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  closeBlockModal(vendor: any) {
    const modal = document.getElementById(
      `hide-modal-${vendor._id}`
    ) as HTMLDivElement;
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }
}
