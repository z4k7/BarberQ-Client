import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AdminService } from 'src/app/services/admin-service.service';
import { IUser } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
})
export class AdminUsersComponent implements OnInit {
  Users: IUser[] = [];

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    initFlowbite();
    this.adminService.getUsers().subscribe((users) => {
      this.Users = users?.data?.adminData;
    });
  }

  onAction(blocked: boolean, index: number, id: string) {
    if (blocked) {
      this.Users[index].is_blocked = false;
      this.adminService.blockUnblockUser(id).subscribe((data) => {
        this.toastr.info(`${this.Users[index].name} is Unblocked`);
      });
    } else {
      this.Users[index].is_blocked = true;
      this.adminService.blockUnblockUser(id).subscribe((data) => {
        this.toastr.info(`${this.Users[index].name} is Blocked`);
      });
    }
  }
}
