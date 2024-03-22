import { Component, OnDestroy, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUserDetails } from 'src/app/state/user-store/user.selector';
import { IUser } from 'src/app/models/user';
import { Subscription } from 'rxjs';
import { deleteUser } from 'src/app/state/user-store/user.actions';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.css'],
})
export class UserNavbarComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private store: Store) {}

  userState$ = this.store.select(selectUserDetails);
  userData!: IUser;
  userSubscription!: Subscription;

  ngOnInit(): void {
    initFlowbite();
    this.userSubscription = this.userState$.subscribe((user) => {
      if (user) this.userData = user;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  onLogout(): void {
    localStorage.removeItem('userJwtAccess');
    localStorage.removeItem('userJwtRefresh');
    this.store.dispatch(deleteUser());
    this.router.navigate(['/user/']);
  }
}
