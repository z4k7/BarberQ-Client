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
    component: UserRegisterComponent,
    canActivate: [loginGuard],
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
    component: UserProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
