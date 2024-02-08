import { Component, AfterViewInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent  implements AfterViewInit {

  ngAfterViewInit(): void {
      initFlowbite()
  }


}
