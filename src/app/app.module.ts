import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TransformUrlInterceptor } from './interceptors/transform-url.interceptor';
import { ErrorHandlerInterceptor } from './interceptors/error-handler.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';
import { StoreModule, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { hydrationMetaReducer } from './state/hydration.reducer';
import { Reducers } from './state/app.state';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgChartsModule } from 'ng2-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpCacheInterceptor } from './interceptors/http-cache.interceptor';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

initializeApp(environment.firebase);

export const metaReducers: MetaReducer[] = [hydrationMetaReducer];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    ToastrModule.forRoot(),
    MatIconModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ScrollingModule,
    NgxSpinnerModule,
    StoreModule.forRoot(Reducers, { metaReducers }),
    EffectsModule.forRoot([]),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000',
    }),
    NgChartsModule,
    FontAwesomeModule,
    SweetAlert2Module.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TransformUrlInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    // { provide: HTTP_INTERCEPTORS, useClass: HttpCacheInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
