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
}
