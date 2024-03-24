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
    services: string[],
    date: string,
    time: string
  ): Observable<any> {
    const body = { salonId, userId, services, date, time };
    return this.http.post(`/user/salons/book-slot`, body, httpOptions);
  }
}
