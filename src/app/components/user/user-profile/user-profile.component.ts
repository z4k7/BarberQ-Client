import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { initFlowbite } from 'flowbite';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/models/user';
import { selectUserDetails } from 'src/app/state/user-store/user.selector';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  userState$ = this.store.select(selectUserDetails);
  userData!: IUser;
  userSubscription!: Subscription;

  constructor(private store: Store) {}

  ngOnInit(): void {
    initFlowbite();

    this.userSubscription = this.userState$.subscribe((user) => {
      if (user) this.userData = user;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
