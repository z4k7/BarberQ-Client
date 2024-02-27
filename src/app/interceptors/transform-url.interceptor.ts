import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class TransformUrlInterceptor implements HttpInterceptor {


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    if (request.headers.has('Bypass-Interceptor')) {
      console.log(`Bypassing interceptor from JwtInterceptor`);
      return next.handle(request)
    }

    // console.log(`No Bypass Interceptor present`, request.url);

    const { baseURL } = environment
    const newReq = request.clone({url:baseURL + request.url})
    console.log(`new url from interceptor`, newReq.url);
    return next.handle(newReq);
  }
}