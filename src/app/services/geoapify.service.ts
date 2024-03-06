import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeoapifyService {
  constructor(private http: HttpClient) {}

  getLocation(lat: number, lng: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Bypass-Interceptor': 'true',
      }),
    };

    const apiKey = environment.geoapify.apiKey;
    const url = `${environment.geoapify.url}?lat=${lat}&lon=${lng}&apiKey=${apiKey}`;

    return this.http.get<any>(url, httpOptions);
  }
}
