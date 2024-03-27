import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRegisterComponent } from './user-register/user-register.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { UserSalonsComponent } from './user-salons/user-salons.component';
import { UserSalonDetailsComponent } from './user-salon-details/user-salon-details.component';
import { UserBookAChairComponent } from './user-book-a-chair/user-book-a-chair.component';
import { loginGuard } from 'src/app/guards/login.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfilecommonComponent } from './user-profilecommon/user-profilecommon.component';
import { UserBookingsComponent } from './user-bookings/user-bookings.component';
import { UserContactusComponent } from './user-contactus/user-contactus.component';
import { authGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    title: 'BarberQ | Login',
    component: UserLoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'register',
    title: 'BarberQ | Register',
    canActivate: [loginGuard],
    component: UserRegisterComponent,
  },
  {
    path: '',
    title: 'BarberQ | Home',
    component: UserHomeComponent,
  },
  {
    path: 'salons',
    title: 'BarberQ | Salon',
    // component: UserSalonsComponent,
    children: [
      {
        path: '',
        title: 'BarberQ | Salon',
        component: UserSalonsComponent,
      },
      {
        path: 'salon-details',
        title: 'BarberQ | Salon Details',
        component: UserSalonDetailsComponent,
      },
      {
        path: 'book-a-chair',
        title: 'BarberQ | Book A Chair',
        component: UserBookAChairComponent,
      },
    ],
  },
  {
    path: 'profile',
    title: 'BarberQ | User Profile',
    component: UserProfilecommonComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        title: 'BarberQ | User Profile',
        component: UserProfileComponent,
      },
      {
        path: 'bookings',
        title: 'BarberQ | User Bookings',
        component: UserBookingsComponent,
      },

      {
        path: 'contact-us',
        title: 'BarberQ | User Contact Us',
        component: UserContactusComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
