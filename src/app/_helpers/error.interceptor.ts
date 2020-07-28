import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApplicationInsightsService } from './application-insights';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        private applicationInsights: ApplicationInsightsService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].indexOf(err.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                this.authenticationService.logout();
                location.reload(true);
            }

            this.applicationInsights.logException(err);
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}