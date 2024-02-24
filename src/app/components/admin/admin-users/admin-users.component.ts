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
      this.Users[index].isBlocked = false;
      this.adminService.blockUnblockUser(id).subscribe((data) => {
        this.toastr.warning(`${this.Users[index].name} is Unblocked`);
        this.closeBlockModal(this.Users[index])
      });
    } else {
      this.Users[index].isBlocked = true;
      this.adminService.blockUnblockUser(id).subscribe((data) => {
        this.toastr.warning(`${this.Users[index].name} is Blocked`);
        this.closeBlockModal(this.Users[index])
      });
    }
  }

  openBlockModal(user: any) {
    const modal = document.getElementById(`hide-modal-${user._id}`) as HTMLDivElement
    if (modal) {
      modal.classList.remove('hidden')
      modal.setAttribute('aria-hidden','false')
    }
  }
  
  closeBlockModal(user: any) {
    const modal = document.getElementById(
      `hide-modal-${user._id}`
    ) as HTMLDivElement
    if (modal) {
      modal.classList.add('hidden')
      modal.setAttribute('aria-hidden','true')
    }
  }

}
