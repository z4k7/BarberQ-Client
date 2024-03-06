import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { isTokenExpired } from '../helpers/jwtToken';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    //? If there is bypass interceptor in header, don't add jwt
    if (request.headers.has('Bypass-Interceptor')) {
      console.log(`Bypassing interceptor from JwtInterceptor`);

      return next.handle(request);
    }

    console.log(`No Bypass Interceptor present`, request.url);
    const urlArr = request.url.split('/');
    const role = urlArr[1];
    const route = urlArr[2];

    console.log(`Handling route:`, route);
    console.log(`urlArr`, urlArr);

    if (route === 'login' || route === 'register') {
      return next.handle(request);
    }

    //? Getting access token from local storage
    const accessToken = localStorage.getItem(role + 'JwtAccess');
    console.warn(`accessToken:`, accessToken);

    //? If access token is available
    if (accessToken !== null && !isTokenExpired(accessToken)) {
      const accessRequest = request.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(`Handling request with access token `);
      return next.handle(accessRequest);
    }

    //? If access token is not present, checking for refresh token
    console.log(`Removing access token`);
    localStorage.removeItem(role + 'JwtAccess');

    const refreshToken = localStorage.getItem(role + 'JwtRefresh');
    console.warn(`refreshToken`, refreshToken);

    //? If refresh token is available
    if (refreshToken !== null && !isTokenExpired(refreshToken)) {
      console.log(`accessToken is not available, generating new token`);
      this.authService.getAccessToken(refreshToken).subscribe({
        next: (res) => {
          const newAccessToken = res.accessToken;
          console.log(`New access token from backend:`, newAccessToken);

          localStorage.setItem(role + 'JwtAccess', newAccessToken);

          const newAccessRequest = request.clone({
            setHeaders: { Authorization: `Bearer ${newAccessToken}` },
          });
          console.log(`Handling request with new access token`);

          return next.handle(newAccessRequest);
        },
      });
    }

    console.log(`Handling request without jwt token`);
    return next.handle(request);
  }
}
