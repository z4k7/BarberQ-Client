import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorRoutingModule } from './vendor-routing.module';
import { VendorLoginComponent } from './vendor-login/vendor-login.component';
import { VendorRegisterComponent } from './vendor-register/vendor-register.component';
import { VendorHomeComponent } from './vendor-home/vendor-home.component';


@NgModule({
  declarations: [
    VendorLoginComponent,
    VendorRegisterComponent,
    VendorHomeComponent
  ],
  imports: [
    CommonModule,
    VendorRoutingModule
  ]
})
export class VendorModule { }
