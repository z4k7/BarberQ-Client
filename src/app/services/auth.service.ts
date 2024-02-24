import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiTokenRes } from '../models/user';

const { baseURL } = environment;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getAccessToken(refreshToken: string): Observable<IApiTokenRes> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${refreshToken}`,
        'Bypass-Interceptor': 'true',
      }),
    };
    console.log(refreshToken, `Refresh token from get access token service.`);

    return this.http.get<IApiTokenRes>(`${baseURL}token`, httpOptions);
  }
}
