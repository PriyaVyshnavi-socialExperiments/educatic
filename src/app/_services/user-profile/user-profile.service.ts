import { Injectable, Injector } from '@angular/core';
import { HttpService } from '../http-client/http.client';
import { map, finalize, catchError } from 'rxjs/operators';
import { IUserProfile, IUser, OfflineSyncURL } from '../../_models';
import { OfflineService } from '../offline/offline.service';

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
    return this.http.Post<Response>(OfflineSyncURL.UserProfile, userProfile)
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
