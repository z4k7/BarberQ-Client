import { Component } from '@angular/core';

@Component({
  selector: 'app-user-salon-details',
  templateUrl: './user-salon-details.component.html',
  styleUrls: ['./user-salon-details.component.css']
})
export class UserSalonDetailsComponent {
  checked: boolean = false; 

  // 
  openAccord(event: MouseEvent, accordionId: string) {
    const accordionElement = document.getElementById(accordionId) as HTMLInputElement;
    if (accordionElement) {
      const isChecked = accordionElement.checked;
      accordionElement.checked = !isChecked;
    }
}



}
