import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { isTokenExpired } from '../helpers/jwtToken';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const role = route.parent?.routeConfig?.path;
  const token = localStorage.getItem(`${role}JwtRefresh`);
  const router: Router = inject(Router);

  console.log(`Role`, role);

  if (token === null || isTokenExpired(token)) {
    router.navigate([`/${role}/login`]);
    return false;
  }

  return true;
};
