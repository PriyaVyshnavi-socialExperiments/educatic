import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { IUser, LoginRequest } from '../_models';
import { HttpService, NavMenuHelper } from '../_helpers';
import { ApplicationInsightsService } from '../_helpers/application-insights';
import { SqliteStorageService } from './sqlite.storage.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    /**
     * `ReplaySubject` used by other providers and components to
     * allow async identification of when the current user
     * is ready.
     */
    // public ready: ReplaySubject<IUser> = new ReplaySubject( 1 );
    private currentUserSubject: BehaviorSubject<IUser>;
    public currentUser: Observable<IUser>;
    private result: any;

    constructor(
        private http: HttpService,
        private appInsightsService: ApplicationInsightsService,
        private sqlStorageService: SqliteStorageService,
    ) {
        this.result = this.sqlStorageService.openStore('User');
        if (this.result) {
            this.getCurrentUser().then((user) => {
                this.currentUserSubject = new BehaviorSubject<IUser>(user);
                this.currentUser = this.currentUserSubject.asObservable();
            });
        }
    }

    public get currentUserValue(): IUser {
        return this.currentUserSubject?.value;
    }

    login(loginRequest: LoginRequest) {
        return this.http.Post<any>(`/login`, loginRequest)
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    this.setCurrentUser(user);
                    this.currentUserSubject.next(user);
                    this.appInsightsService.setUserId(user.id)
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        this.sqlStorageService.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.appInsightsService.clearUserId();
    }

    private async getCurrentUser() {
        if (this.result) {
            const user = await this.sqlStorageService.getItem('currentUser');
            return JSON.parse(user);
        } else {
            throw new Error('GetCurrentUser: CapacitorDataStorageSqlite Service is not initialized.');
        }
    }

    private async setCurrentUser(user: IUser) {
        if (this.result) {
            await this.sqlStorageService.setItem('currentUser', JSON.stringify(user));
        } else {
            throw new Error('SetCurrentUser: CapacitorDataStorageSqlite Service is not initialized.');
        }
    }
}