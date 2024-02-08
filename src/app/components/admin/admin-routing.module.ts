import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';

// const routes: Routes = [
//   {
//     path: 'login',
//     title: 'Admin | Login',
//     component: AdminLoginComponent,
//   },
//   {
//     path: '',
//     pathMatch:'full',
//     title: 'Admin | Home',
//     component: AdminHomeComponent,
//     children: [
//       {
//         path: 'adminUsers',
//         title: 'Admin | Users',
//         component: AdminUsersComponent,
//       },
//     ],
//   },
// ];
const routes: Routes = [
  {
    path: 'login',
    title: 'Admin | Login',
    component: AdminLoginComponent,
  },
  {
    path: '', // Empty path for the Admin module root
    component: AdminHomeComponent,
    children: [
      {
        path: 'adminUsers',
        title: 'Admin | Users',
        component: AdminUsersComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
