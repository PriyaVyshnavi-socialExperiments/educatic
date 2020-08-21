import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { IUser, LoginRequest } from '../../_models';
import { ApplicationInsightsService } from '../../_helpers/application-insights';
import { OfflineService } from '../offline/offline.service';
import { HttpService } from '../http-client/http.client';
import { NavMenuHelper } from 'src/app/_helpers/nav-menus';
import { IResetPassword } from 'src/app/_models/reset-password';

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends OfflineService {

    /**
     * `ReplaySubject` used by other providers and components to
     * allow async identification of when the current user
     * is ready.
     */
    public ready: ReplaySubject<IUser> = new ReplaySubject(1);
    private currentUserSubject: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(undefined);
    public currentUser: Observable<IUser>;

    constructor(
        private http: HttpService,
        private appInsightsService: ApplicationInsightsService,
        public injector: Injector,
        private menuHelper: NavMenuHelper,
    ) {
        super(injector);
        this.GetOfflineData('User', 'current-user').then((user) => {
            this.currentUserSubject = new BehaviorSubject<IUser>(user);
            this.currentUser = this.currentUserSubject.asObservable();
            this.ready.next(user);
        });
    }

    public get currentUserValue(): IUser {
        return this.currentUserSubject?.value;
    }

    public Login(loginRequest: LoginRequest) {
        return this.http.Post<any>(`/login`, loginRequest)
            .pipe(
                map(response => {
                    // login successful if there's a jwt token in the response
                    if (response && response.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        response.menuItems = [... this.menuHelper.GetMenuList(response.role)];
                        response.schools = [...response.schools];
                        response.classRooms = [...response.schools[0].classRooms];
                        response.schoolId = response.schools[0].id;
                        this.SetOfflineData('User', 'current-user', response);
                        this.currentUserSubject.next(response);
                        this.ready.next(response);
                        this.appInsightsService.setUserId(response.id)
                    }
                    return response;
                }));
    }

    public Logout() {
        this.RemoveOfflineData('User', 'current-user');
        this.currentUserSubject.next(null);
        this.ready.next(undefined);
        this.appInsightsService.clearUserId();
    }

    public ResetPassword(resetPassword: IResetPassword) {
        return this.http.Post<any>(`/reset/password`, resetPassword)
            .pipe(
                map(response => {
                    return response;
                })
            );
    }

    public VerifyEmail(emailId: string) {
          return this.http.Get<boolean>(`/verifyemail/${emailId}`);
      }
}