import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorRoutingModule } from './vendor-routing.module';
import { VendorLoginComponent } from './vendor-login/vendor-login.component';
import { VendorRegisterComponent } from './vendor-register/vendor-register.component';
import { VendorHomeComponent } from './vendor-home/vendor-home.component';

import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { VendorNavbarComponent } from './vendorCommon/vendor-navbar/vendor-navbar.component';
import { VendorSidebarComponent } from './vendorCommon/vendor-sidebar/vendor-sidebar.component';
import { VendorAddSalonComponent } from './vendor-add-salon/vendor-add-salon.component';
import { MapBoxComponent } from '../common/map-box/map-box.component';

@NgModule({
  declarations: [
    VendorLoginComponent,
    VendorRegisterComponent,
    VendorHomeComponent,
    VendorNavbarComponent,
    VendorSidebarComponent,
    VendorAddSalonComponent,
  ],
  imports: [
    CommonModule,
    VendorRoutingModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    MatIconModule,
    FormsModule,
    MapBoxComponent,
  ],
})
export class VendorModule {}
