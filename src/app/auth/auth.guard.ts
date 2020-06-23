import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authservice: AuthService, private router: Router) { }

  canActivate(
    route: import('@angular/router').ActivatedRouteSnapshot,
    state: import('@angular/router').RouterStateSnapshot): boolean |
    import('@angular/router').UrlTree | import('rxjs').Observable<boolean |
    import('@angular/router').UrlTree> | Promise<boolean |
    import('@angular/router').UrlTree> {
    const isAuth = this.authservice.getIsAuthenticated();
    if (!isAuth) {
      this.router.navigate(['/login']);
    }
    return isAuth;
  }

}

