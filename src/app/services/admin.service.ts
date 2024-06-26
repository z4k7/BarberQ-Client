import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IService } from '../models/service';
import { IApiResponse } from '../models/common';

const httpOptions = {
  headers: new HttpHeaders({
    'content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getUsers(page: number, limit: number, searchQuery?: string): Observable<any> {
    return this.http.get(
      `/admin/users?page=${page}&limit=${limit}&searchQuery=${searchQuery}`,
      httpOptions
    );
  }

  getVendors(
    page: number,
    limit: number,
    searchQuery?: string
  ): Observable<any> {
    return this.http.get(
      `/admin/vendors/?page=${page}&limit=${limit}&searchQuery=${searchQuery}`,
      httpOptions
    );
  }
  getSalons(
    page: number,
    limit: number,
    searchQuery?: string
  ): Observable<any> {
    return this.http.get(
      `/admin/salons/?page=${page}&limit=${limit}&searchQuery=${searchQuery}`,
      httpOptions
    );
  }

  getSalonById(salonId: string): Observable<any> {
    return this.http.get(`/admin/salons/salon-details/${salonId}`, httpOptions);
  }

  getServices(
    page: number,
    limit: number,
    searchQuery?: string
  ): Observable<any> {
    return this.http.get(
      `/admin/services/?page=${page}&limit=${limit}&searchQuery=${searchQuery}`,
      httpOptions
    );
  }

  addService(service: IService): Observable<any> {
    return this.http.post<any>(
      `/admin/services/addService`,
      service,
      httpOptions
    );
  }

  editService(service: IService): Observable<IApiResponse<IService>> {
    return this.http.put<IApiResponse<IService>>(
      `/admin/services/editService`,
      service,
      httpOptions
    );
  }
  updateSalonStatus(salonId: string, status: string): Observable<any> {
    return this.http.patch(
      `/admin/salons/${salonId}/status`,
      { status },
      httpOptions
    );
  }

  hideService(id: string): Observable<any> {
    return this.http.patch(`/admin/services/hide/${id}`, httpOptions);
  }

  blockUnblockUser(id: string): Observable<any> {
    console.log(id, 'id');
    return this.http.patch(`/admin/users/block/${id}`, httpOptions);
  }

  blockUnblockVendor(id: string): Observable<any> {
    console.log(id, 'id');
    return this.http.patch(`/admin/vendors/block/${id}`, httpOptions);
  }

  getDashboardData(): Observable<any> {
    return this.http.get(`/admin/dashboard`, httpOptions);
  }
}
