import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorRoutingModule } from './vendor-routing.module';
import { VendorLoginComponent } from './vendor-login/vendor-login.component';
import { VendorRegisterComponent } from './vendor-register/vendor-register.component';
import { VendorHomeComponent } from './vendor-home/vendor-home.component';

import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VendorLoginComponent,
    VendorRegisterComponent,
    VendorHomeComponent
  ],
  imports: [
    CommonModule,
    VendorRoutingModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class VendorModule { }
