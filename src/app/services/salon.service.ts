import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class SalonService {
  constructor(private http: HttpClient) {}

  getUserBookings(
    page: number,
    limit: number,
    userId: string,
    searchQuery?: string
  ): Observable<any> {
    return this.http.get(
      `/user/salons/bookings?page=${page}&limit=${limit}&userId=${userId}&searchQuery=${searchQuery}`,
      httpOptions
    );
  }

  cancelBooking(bookingId: string): Observable<any> {
    const body = { bookingId };
    return this.http.post(`/user/salons/cancel-booking`, body, httpOptions);
  }

  getAvailableSlots(
    salonId: string,
    services: string[],
    date: string
  ): Observable<any> {
    const params = { salonId, services, date };
    return this.http.get(`/user/salons/available-slots`, { params });
  }

  bookSlot(
    salonId: string,
    userId: string,
    paymentId: string,
    services: string[],
    date: string,
    time: string
  ): Observable<any> {
    const body = { salonId, userId, paymentId, services, date, time };
    return this.http.post(`/user/salons/book-slot`, body, httpOptions);
  }

  createPaymentOrder(amount: number): Observable<any> {
    const body = { amount };
    return this.http.post(`/user/salons/create-order`, body, httpOptions);
  }

  verifyPayment(paymentResponse: any): Observable<any> {
    const body = {
      razorpayPaymentId: paymentResponse.razorpay_payment_id,
      razorpayOrderId: paymentResponse.razorpay_order_id,
      razorpaySignature: paymentResponse.razorpay_signature,
    };
    return this.http.post(`/user/salons/verify-payment`, body, httpOptions);
  }

  getDashboardData(salonId: string): Observable<any> {
    return this.http.get(`/vendor/dashboard/salon/${salonId}`, httpOptions);
  }
}
