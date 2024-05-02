import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // this.spinner.show();

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMessage = 'An error occurred during login.';
        console.error(err.error);
        if (err.error && err.error.data && err.error.data.message) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          errorMessage = err.error.data.message;
        }
        this.toastr.error(errorMessage, 'Error!');

        return throwError(() => err);
      })
      // finalize(() => {
      //   setTimeout(() => {
      //     this.spinner.hide();
      //   }, 1000);
      // }
      //   )
    );
  }
}
