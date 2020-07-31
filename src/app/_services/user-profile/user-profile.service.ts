import { Injectable, Injector } from '@angular/core';
import { HttpService } from '../../_helpers/http.client';
import { map, finalize, catchError } from 'rxjs/operators';
import { IUserProfile } from '../../_models';
import { OfflineService } from '../offline/offline.service';

@Injectable({
  providedIn: 'root'
})

export class UserProfileService extends OfflineService {

  constructor(
    private http: HttpService,
    public injector: Injector
  ) {
    super(injector, 'User');
  }

  public UpdateUserProfile(userProfile: IUserProfile) {
    return this.http.Post<Response>(`/user/profile`, userProfile)
      .pipe(
        map(response => {
          if (response) {
          }
          return response;
        }),
        finalize(() => this.SetOfflineData('current-user', userProfile))
      );
  }
}
