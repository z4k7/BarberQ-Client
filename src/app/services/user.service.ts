import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IApiResponse } from '../models/common';
import { IService } from '../models/service';

const httpOptions = {
  headers: new HttpHeaders({
    'content-Type': 'application/json',
    'Bypass-spinner': 'true',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getSalons(page: number, limit: number, searchQuery: string): Observable<any> {
    return this.http.get(
      `/user/salon?page=${page}&limit=${limit}&searchQuery=${searchQuery}`,
      httpOptions
    );
  }
  getSalonDetails(salonId: string): Observable<any> {
    return this.http.get(`/user/salon/${salonId}`);
  }

  getServices(serviceIds: string[]): Observable<any> {
    const queryParams = serviceIds.map((id) => `serviceIds=${id}`).join('&');
    console.log(`Query params`, queryParams);
    return this.http.get(`/user/salon/get-services?${queryParams}`);
  }
}

// interface IApiService extends IApiResponse<IService> {}
