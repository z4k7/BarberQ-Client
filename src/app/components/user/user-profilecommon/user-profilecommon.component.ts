import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-user-profilecommon',
  templateUrl: './user-profilecommon.component.html',
  styleUrls: ['./user-profilecommon.component.css'],
})
export class UserProfilecommonComponent implements OnInit {
  activeMenuItem: string = '/user/profile';
ngOnInit(): void {
  initFlowbite()
}
  setActiveMenuItem(menuItem: string) {
    this.activeMenuItem = menuItem;
  }
}
