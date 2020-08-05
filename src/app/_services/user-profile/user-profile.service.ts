import { Injectable, Injector } from '@angular/core';
import { HttpService } from '../http-client/http.client';
import { map, finalize, catchError } from 'rxjs/operators';
import { IUserProfile, IUser } from '../../_models';
import { OfflineService } from '../offline/offline.service';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserProfileService extends OfflineService {

  constructor(
    private http: HttpService,
    public injector: Injector
  ) {
    super(injector);
  }

  public UpdateUserProfile(userProfile: IUserProfile, offlineUserData: IUser) {
    return this.http.Post<Response>(`/user/profile`, userProfile)
      .pipe(
        map(response => {
          if (response) {
          }
          return response;
        }),
        finalize(() => {
          this.SetOfflineData('User', 'current-user', offlineUserData);
        })
      );
  }
}
