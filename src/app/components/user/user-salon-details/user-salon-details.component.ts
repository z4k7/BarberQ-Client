import { Component,OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-user-salon-details',
  templateUrl: './user-salon-details.component.html',
  styleUrls: ['./user-salon-details.component.css']
})
export class UserSalonDetailsComponent implements OnInit {
  checked: boolean = false; 
  salon:any
JSON: any;

  constructor(private route: ActivatedRoute,
  private router: Router) { }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['salon']) {
        this.salon = JSON.parse(params['salon'])
        console.log(this.salon, 'salon from query');
        
        }
      })
  }

  bookChair(salon: any): void {
    this.router.navigate(['/user/salons/book-a-chair'], { queryParams: { salon: JSON.stringify(salon) } });
  }


  openAccord(event: MouseEvent, accordionId: string) {
    const accordionElement = document.getElementById(accordionId) as HTMLInputElement;
    if (accordionElement) {
      const isChecked = accordionElement.checked;
      accordionElement.checked = !isChecked;
    }
}



}
