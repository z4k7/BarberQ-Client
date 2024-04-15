import {
  Component,
  OnDestroy,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
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
  @ViewChild('userMenuButton') userMenuButton!: ElementRef;
  @ViewChild('profileDropdown') profileDropdown!: ElementRef;

  constructor(private router: Router, private store: Store) {}

  userState$ = this.store.select(selectUserDetails);
  userData!: IUser;
  userSubscription!: Subscription;

  dropdownVisible = false;

  ngOnInit(): void {
    initFlowbite();
    this.userSubscription = this.userState$.subscribe((user) => {
      if (user) this.userData = user;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  onLogout(): void {
    localStorage.removeItem('userJwtAccess');
    localStorage.removeItem('userJwtRefresh');
    this.store.dispatch(deleteUser());
    this.router.navigate(['/user/']);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: { target: any }) {
    if (
      this.userMenuButton.nativeElement !== event.target &&
      !this.userMenuButton.nativeElement.contains(event.target) &&
      this.profileDropdown.nativeElement !== event.target &&
      !this.profileDropdown.nativeElement.contains(event.target)
    ) {
      this.dropdownVisible = false;
    }
  }
}
