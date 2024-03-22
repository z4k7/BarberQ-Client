import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';

import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserHomeComponent } from './user-home/user-home.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { UserSalonsComponent } from './user-salons/user-salons.component';
import { UserSalonDetailsComponent } from './user-salon-details/user-salon-details.component';
import { UserBookAChairComponent } from './user-book-a-chair/user-book-a-chair.component';
import { DatePickerComponent } from '../common/date-picker/date-picker.component';
import { UserNavbarComponent } from './userCommon/user-navbar/user-navbar.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LoaderComponent } from '../common/loader/loader.component';
import { FooterComponent } from './userCommon/footer/footer.component';
import { FilterComponent } from './userCommon/filter/filter.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  declarations: [
    UserLoginComponent,
    UserRegisterComponent,
    UserHomeComponent,
    UserSalonsComponent,
    UserSalonDetailsComponent,
    UserBookAChairComponent,
    UserNavbarComponent,
    FooterComponent,
    FilterComponent,
    UserProfileComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    MatIconModule,
    DatePickerComponent,
    ScrollingModule,
    LoaderComponent,
    NgxSpinnerModule,
  ],
})
export class UserModule {}
