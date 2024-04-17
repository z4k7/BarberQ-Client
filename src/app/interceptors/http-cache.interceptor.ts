import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  private cache: Map<string, HttpResponse<any>> = new Map();
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check if the request is cacheable
    // if (
    //   request.method === 'GET' &&
    //   request.url.includes('/api/salons') &&
    //   request.url.includes('/api/services')
    // ) {
    //   const cacheKey = request.url;

    //   // Check if the response is in the cache
    //   if (this.cache.has(cacheKey)) {
    //     return of(this.cache.get(cacheKey)!);
    //   }

    //   // If not in cache, make the request and cache the response
    //   return next.handle(request).pipe(
    //     tap((event) => {
    //       if (event instanceof HttpResponse) {
    //         this.cache.set(cacheKey, event);
    //       }
    //     })
    //   );
    // }

    // If the request is not cacheable, pass it through
    return next.handle(request);
  }
}
