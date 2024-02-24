import { Component,OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AdminService } from 'src/app/services/admin-service.service';
import { IVendor } from 'src/app/models/vendor';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-admin-vendors',
  templateUrl: './admin-vendors.component.html',
  styleUrls: ['./admin-vendors.component.css']
})
export class AdminVendorsComponent implements OnInit{

Vendors : IVendor[] = []

  constructor(
    private adminService: AdminService,
    private toastr : ToastrService
  ) { }
  
  ngOnInit() {
    initFlowbite()

    this.adminService.getVendors().subscribe((vendors) => {
      this.Vendors = vendors?.data?.adminData
      console.log(`vendors`, this.Vendors);
    })
  }

  onAction(blocked: boolean, index: number, id: string) {
    if (blocked) {
      this.Vendors[index].isBlocked = false;
      this.adminService.blockUnblockVendor(id).subscribe((data) => {
        this.toastr.warning(`${this.Vendors[index].name} is Unblocked`);
        this.closeBlockModal(this.Vendors[index])

      });
    } else {
      this.Vendors[index].isBlocked = true;
      this.adminService.blockUnblockVendor(id).subscribe((data) => {
        this.toastr.warning(`${this.Vendors[index].name} is Blocked`);
        this.closeBlockModal(this.Vendors[index])

      });
    }
  }

  openBlockModal(vendor: any) {
    const modal = document.getElementById(`hide-modal-${vendor._id}`) as HTMLDivElement
    if (modal) {
      modal.classList.remove('hidden')
      modal.setAttribute('aria-hidden','false')
    }
  }
  
  closeBlockModal(vendor: any) {
    const modal = document.getElementById(
      `hide-modal-${vendor._id}`
    ) as HTMLDivElement
    if (modal) {
      modal.classList.add('hidden')
      modal.setAttribute('aria-hidden','true')
    }
  }

}
