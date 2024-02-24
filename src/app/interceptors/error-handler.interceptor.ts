import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private toastr : ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {

      let errorMessage = 'An error occurred during login.';
      if (err.error && err.error.data && err.error.data.message) {
        errorMessage = err.error.data.message;
      }
     this.toastr.error(errorMessage);

      return throwError(()=>err)

    }))
  }
}
