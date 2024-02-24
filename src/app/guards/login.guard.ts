import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { isTokenExpired } from '../helpers/jwtToken';
import {  inject } from '@angular/core';

export const loginGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const role = route.parent?.routeConfig?.path;
  const token = localStorage.getItem(`${role}JwtRefresh`);
  const router: Router = inject(Router)

  if (token === null || isTokenExpired(token)) {
    return true;
  } else {
    router.navigate([`/${role}`]);
    return false;
  }
};
