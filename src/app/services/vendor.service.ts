import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IService } from '../models/service';

const httpOptions = {
  headers: new HttpHeaders({
    'content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  constructor(private http: HttpClient) {}

  updateSalon(salonId: string, updatedSalonDetails: any): Observable<any> {
    return this.http.patch(
      `/vendor/salons/${salonId}`,
      updatedSalonDetails,
      httpOptions
    );
  }

  updateSalonServices(salonId: string, services: IService[]): Observable<any> {
    return this.http.put(
      `/vendor/salons/${salonId}/services`,
      services,
      httpOptions
    );
  }

  editSalonServices(salonId: string, services: IService[]): Observable<any> {
    return this.http.patch(
      `/vendor/salons/${salonId}/services`,
      services,
      httpOptions
    );
  }

  deleteSalonServices(salonId: string, services: IService[]): Observable<any> {
    const serviceIds = services.map((service) => service._id);
    return this.http.delete(`/vendor/salons/${salonId}/services`, {
      ...httpOptions,
      body: { serviceIds },
    });
  }

  getAllServices(): Observable<any> {
    return this.http.get('/vendor/services', httpOptions);
  }

  getSalonServices(salonId: string): Observable<any> {
    return this.http.get(`/vendor/salons/${salonId}/services`, httpOptions);
  }

  getSalons(
    page: number,
    limit: number,
    vendorId: string,
    searchQuery?: string
  ): Observable<any> {
    return this.http.get(
      `/vendor/salons/${vendorId}?page=${page}&limit=${limit}&searchQuery=${searchQuery}`,
      httpOptions
    );
  }

  getSalonById(salonId: string): Observable<any> {
    return this.http.get(
      `/vendor/salons/salon-details/${salonId}`,
      httpOptions
    );
  }

  updateSalonStatus(salonId: string, status: string): Observable<any> {
    return this.http.patch(
      `/vendor/salons/${salonId}/status`,
      { status },
      httpOptions
    );
  }

  createPaymentOrder(amount: number): Observable<any> {
    const body = { amount };
    return this.http.post(`/vendor/salons/create-order`, body, httpOptions);
  }

  verifyPayment(paymentResponse: any): Observable<any> {
    const body = {
      razorpayPaymentId: paymentResponse.razorpay_payment_id,
      razorpayOrderId: paymentResponse.razorpay_order_id,
      razorpaySignature: paymentResponse.razorpay_signature,
    };
    return this.http.post(`/vendor/salons/verify-payment`, body);
  }
}
