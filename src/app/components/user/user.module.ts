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
import { NgxSpinnerModule } from 'ngx-spinner';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfilecommonComponent } from './user-profilecommon/user-profilecommon.component';
import { UserBookingsComponent } from './user-bookings/user-bookings.component';
import { UserContactusComponent } from './user-contactus/user-contactus.component';
import { SharedModule } from 'src/app/shared/shared.module';

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
    UserProfileComponent,
    UserProfilecommonComponent,
    UserBookingsComponent,
    UserContactusComponent,
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
    SharedModule,
  ],
})
export class UserModule {}
