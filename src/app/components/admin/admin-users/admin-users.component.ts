import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AdminService } from 'src/app/services/admin-service.service';
import { IUser } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
})
export class AdminUsersComponent implements OnInit {
  Users: IUser[] = [];
  allUsers: IUser[] = []
  currentPage = 1;
  itemsPerPage = 10;
  searchQuery: string = '';
  userCount = 0;
  searchForm!: FormGroup;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    initFlowbite();
    this.getUsers();

    this.searchForm = this.fb.group({
      searchQuery: [''],
    });
    this.searchForm
      .get('searchQuery')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.searchQuery = value;
        this.currentPage = 1;
        this.getUsers();
      });
  }

  getUsers(): void {
    this.adminService
      .getUsers(this.currentPage, this.itemsPerPage, this.searchQuery)
      .subscribe({
        next: (res) => {
          if (res.data !== null) {
            console.log(`response from backend`, res);
            this.Users = res.data.adminData.users;
            this.allUsers = res.data.adminData.users;
            this.userCount = res.data.adminData.userCount;
          }
        },
      });
  }

  setItemsPerPage(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.getUsers();
  }

  setFilter(filterOption: string): void {
    if (filterOption === 'all') {
      this.Users = this.allUsers
    } else if (filterOption === 'active') {
      this.Users = this.allUsers.filter((user) => !user.isBlocked);
    } else if (filterOption === 'blocked') {
      this.Users = this.allUsers.filter((user) => user.isBlocked);
    }
    this.itemsPerPage = this.Users.length;
    this.currentPage = 1;
  }

  onSearch(): void {
    this.searchQuery = this.searchForm.get('searchQuery')?.value;
    console.log(`search submitted`, this.searchQuery);
    this.currentPage = 1;
    this.getUsers();
  }

 

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getUsers();
  }

  
  getLastItemIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.userCount);
  }

  get totalPages(): number[] {
    return Array.from(
      { length: Math.ceil(this.userCount / this.itemsPerPage) },
      (_, i) => i + 1
    );
  }

  onAction(blocked: boolean, index: number, id: string) {
    if (blocked) {
      this.Users[index].isBlocked = false;
      this.adminService.blockUnblockUser(id).subscribe((data) => {
        this.toastr.warning(`${this.Users[index].name} is Unblocked`);
        this.closeBlockModal(this.Users[index]);
      });
    } else {
      this.Users[index].isBlocked = true;
      this.adminService.blockUnblockUser(id).subscribe((data) => {
        this.toastr.warning(`${this.Users[index].name} is Blocked`);
        this.closeBlockModal(this.Users[index]);
      });
    }
  }

  openBlockModal(user: any) {
    const modal = document.getElementById(
      `hide-modal-${user._id}`
    ) as HTMLDivElement;
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  closeBlockModal(user: any) {
    const modal = document.getElementById(
      `hide-modal-${user._id}`
    ) as HTMLDivElement;
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }
}
