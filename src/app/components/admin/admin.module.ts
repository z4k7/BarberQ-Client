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




@NgModule({
  declarations: [AdminLoginComponent, AdminHomeComponent, SidebarComponent, NavbarComponent, MainBodyComponent, AdminUsersComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
  ],
})
export class AdminModule {}
