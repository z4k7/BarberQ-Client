import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-book-a-chair',
  templateUrl: './user-book-a-chair.component.html',
  styleUrls: ['./user-book-a-chair.component.css'],
})
export class UserBookAChairComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  salon: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['salon']) {
        this.salon = JSON.parse(params['salon']);
        console.log(this.salon, 'salon from query');
      }
    });
  }
}
