import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profilecommon',
  templateUrl: './user-profilecommon.component.html',
  styleUrls: ['./user-profilecommon.component.css'],
})
export class UserProfilecommonComponent {
  activeMenuItem: string = '/user/profile';

  setActiveMenuItem(menuItem: string) {
    this.activeMenuItem = menuItem;
  }
}
