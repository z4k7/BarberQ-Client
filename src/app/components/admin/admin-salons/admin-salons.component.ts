import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ISalon } from 'src/app/models/salon';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-salons',
  templateUrl: './admin-salons.component.html',
  styleUrls: ['./admin-salons.component.css'],
})
export class AdminSalonsComponent implements OnInit {
  Salons: ISalon[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchQuery: string = '';
  salonCount = 0;
  searchForm!: FormGroup;
  limitOpen: boolean = false;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    initFlowbite();
    this.getSalons();

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

  toggleLimit() {
    this.limitOpen = !this.limitOpen;
  }

  closeLimit() {
    this.limitOpen = false;
  }

  getSalons(): void {
    this.adminService
      .getSalons(this.currentPage, this.itemsPerPage, this.searchQuery)
      .subscribe({
        next: (res) => {
          console.log(`Response`, res);
          if (res.data !== null) {
            this.Salons = res.data.salonData.salons;
            this.salonCount = res.data.salonData.salonCount;
          }
        },
      });
  }

  setItemsPerPage(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.getSalons();
  }

  // setFilter(filterOption: string): void{

  // }

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
}
