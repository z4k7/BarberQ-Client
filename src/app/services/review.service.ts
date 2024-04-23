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
export class ReviewService {
  constructor(private http: HttpClient) {}

  addReview(salonId: string, review: any): Observable<any> {
    return this.http.post(
      `/user/reviews?salonId=${salonId}`,
      review,
      httpOptions
    );
  }

  getReviews(salonId: string): Observable<any> {
    return this.http.get(`/user/reviews?salonId=${salonId}`, httpOptions);
  }

  getAverageRating(salonId: string): Observable<any> {
    return this.http.get(
      `/user/reviews/average?salonId=${salonId}`,
      httpOptions
    );
  }

  userInBooking(salonId: string, userId: any): Observable<any> {
    return this.http.post(
      `/user/reviews/user-in-booking?salonId=${salonId}`,
      userId,
      httpOptions
    );
  }

  findReview(salonId: string, userId: any): Observable<any> {
    return this.http.post(
      `/user/reviews/find-review?salonId=${salonId}`,
      userId,
      httpOptions
    );
  }

  editReview(salonId: string, review: any): Observable<any> {
    return this.http.put(
      `/user/reviews?salonId=${salonId}`,
      review,
      httpOptions
    );
  }
}
