import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/authentication/authentication.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        return this.authenticationService.ready.pipe(
            take(1),
            map(user => {
                console.log("AuthGuard: ", user)
                if (!user) {
                    this.router.navigate(['/login']);
                    return false;
                }
                return true;
            })
        )
    }
}