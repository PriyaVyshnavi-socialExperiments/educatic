import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, ReplaySubject } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

import { IUser, LoginRequest, StudentLoginRequest, ISchool, OfflineSync, Role } from '../../_models';
import { ApplicationInsightsService } from '../../_helpers/application-insights';
import { OfflineService } from '../offline/offline.service';
import { HttpService } from '../http-client/http.client';
import { IResetPassword } from 'src/app/_models/reset-password';
import { CountryStateCityService } from '../country-state-city/country-state-city.service';
import { NavMenuService } from '../nav-menu/nav-menu.service';
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
        private menuService: NavMenuService,
        private countryService: CountryStateCityService,
    ) {
        super(injector);
        this.GetOfflineData('User', 'current-user').then((user) => {
            this.currentUserSubject = new BehaviorSubject<IUser>(user);
            this.currentUser = this.currentUserSubject.asObservable();
            this.ready.next(user);
            this.SyncOfflineData();
        });
    }

    public get currentUserValue(): IUser {
        return this.currentUserSubject?.value;
    }

    public Login(loginRequest: LoginRequest) {
        const loginResponse = this.http.Post<any>(`/login`, loginRequest)
            .pipe(
                mergeMap(response => {
                    // login successful if there's a jwt token in the response
                    if (response && response.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        return this.menuService.GetMenuList(response.role).then((menus) => {
                            response.menuItems = [...menus];
                            response.schools = [...response.schools];
                            response.courseContent = [...response.courseContent];
                            this.currentUserSubject.next(response);
                            this.ready.next(response);
                            this.appInsightsService.setUserId(response.id)
                            if (response.schools.length) {
                                this.ResetDefaultSchool(response.schools[0].id)
                            }
                            this.CourseContentOfflineSave(response.courseContent);
                            return response;
                        })
                    }
                }));
        const countryResponse = this.countryService.AllCountries();
        return forkJoin([loginResponse, countryResponse]);
    }

    public StudentLogin(loginRequest: StudentLoginRequest) {
        return this.http.Post<any>(`/login/student`, loginRequest)
            .pipe(
                mergeMap(response => {
                    // login successful if there's a jwt token in the response
                    if (response && response.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        return this.menuService.GetMenuList(response.role).then((menus) => {
                            response.menuItems = [...menus];
                            response.schools = [...response.schools];
                            this.currentUserSubject.next(response);
                            this.ready.next(response);
                            this.appInsightsService.setUserId(response.id)
                            this.ResetDefaultSchool(response.schools[0].id)
                        });
                        return response;
                    }
                }));
    }

    public Logout() {
        this.RemoveOfflineData('User', 'current-user');
        this.RemoveOfflineData('nav-menu', 'nav-menu');
        this.RemoveOfflineData('countries-states-cities', 'countries-states-cities');
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

    public ResetDefaultSchool(schoolId: string) {
        this.currentUser.subscribe((currentUser) => {
            if (currentUser) {
                currentUser.defaultSchool = currentUser.schools?.find((s) => s.id === schoolId);
                if(currentUser.role === Role.Student) {
                    currentUser.classId = currentUser.defaultSchool?.classRooms[0]?.classId;
                }
                this.SetOfflineData('User', 'current-user', currentUser);
            }
        });
    }

    public RefreshSchools(schools: ISchool[], school: ISchool) {
        const schoolList = schools.filter((obj) => {
            return obj.id !== (school ? school.id : '');
        });
        if (school) {
            schoolList.unshift(school);
        }
        this.currentUser.subscribe(async (currentUser) => {
            if (currentUser) {
                currentUser.schools = schoolList;
                currentUser.defaultSchool = school;
                await this.SetOfflineData('User', 'current-user', currentUser);
            }
        });
    }

    private async CourseContentOfflineSave(courseContentList) {
        await this.SetOfflineData('CourseContent', 'course-content', courseContentList);
    }

    private SyncOfflineData() {
        this.currentUser.subscribe(async (currentUser) => {
            OfflineSync.Data.forEach(offlineData => {
                this.GetOfflineData(offlineData.table, offlineData.key).then((data) => {
                    if (data) {
                        currentUser[offlineData.table] = data;
                    }
                });
            });
        });

    }
}