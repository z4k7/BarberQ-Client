import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

declare let Razorpay: any;

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  paymentSuccess: EventEmitter<any> = new EventEmitter();

  private rzp: any;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private route: Router
  ) {}

  openPaymentModal(options: any) {
    // options.handler = (response: any) => {
    //   console.log(`Response Inside payment response handler`, response);

    //   this.paymentSuccess.emit(response);
    // };
    this.rzp = new Razorpay(options);
    this.rzp.open();
  }
}
