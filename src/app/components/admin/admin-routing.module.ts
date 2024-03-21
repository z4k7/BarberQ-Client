import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminVendorsComponent } from './admin-vendors/admin-vendors.component';
import { AdminServicesComponent } from './admin-services/admin-services.component';
import { AdminOverviewComponent } from './admin-overview/admin-overview.component';
import { AdminSalonsComponent } from './admin-salons/admin-salons.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { loginGuard } from 'src/app/guards/login.guard';
import { AdminSalonDetailsComponent } from './admin-salon-details/admin-salon-details.component';

const routes: Routes = [
  {
    path: 'login',
    title: 'Admin | Login',
    component: AdminLoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: '', // Empty path for the Admin module root
    component: AdminHomeComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'adminUsers',
        title: 'Admin | Users',
        component: AdminUsersComponent,
      },
      {
        path: 'adminVendors',
        title: 'Admin | Vendors',
        component: AdminVendorsComponent,
      },
      {
        path: 'adminServices',
        title: 'Admin | Services',
        component: AdminServicesComponent,
      },
      {
        path: 'adminSalons',
        title: 'Admin | Salons',
        component: AdminSalonsComponent,
      },
      {
        path: 'adminOverview',
        title: 'Admin | Overview',
        component: AdminOverviewComponent,
      },
      {
        path: 'salon-details/:id',
        title: 'Admin | Salon Details',
        component: AdminSalonDetailsComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'adminOverview',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
