import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminLoginComponent } from './admin-login/admin-login.component';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { SidebarComponent } from './adminCommon/sidebar/sidebar.component';
import { NavbarComponent } from './adminCommon/navbar/navbar.component';
import { MainBodyComponent } from './adminCommon/main-body/main-body.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { AdminVendorsComponent } from './admin-vendors/admin-vendors.component';
import { AdminServicesComponent } from './admin-services/admin-services.component';
import { AdminOverviewComponent } from './admin-overview/admin-overview.component';
import { AdminSalonsComponent } from './admin-salons/admin-salons.component';
import { AdminSalonDetailsComponent } from './admin-salon-details/admin-salon-details.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AdminLoginComponent,
    AdminHomeComponent,
    SidebarComponent,
    NavbarComponent,
    MainBodyComponent,
    AdminUsersComponent,
    AdminVendorsComponent,
    AdminServicesComponent,
    AdminOverviewComponent,
    AdminSalonsComponent,
    AdminSalonDetailsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    MatSlideToggleModule,
    MatIconModule,
    SharedModule,
  ],
})
export class AdminModule {}
