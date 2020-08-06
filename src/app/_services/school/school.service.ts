import { Injectable, Injector } from '@angular/core';
import { HttpService } from '../http-client/http.client';
import { OfflineService } from '../offline/offline.service';
import { tap } from 'rxjs/operators';
import { ISchool, OfflineSyncURL } from '../../_models';
import { from, of } from 'rxjs';
import { NetworkService } from '../../_services/network/network.service';



@Injectable({
  providedIn: 'root'
})
export class SchoolService extends OfflineService {

  constructor(
    private http: HttpService,
    public injector: Injector,
    private network: NetworkService,
  ) {
    super(injector);
  }

  public GetSchools() {
    if (!this.network.IsOnline) {
      return from(this.GetOfflineData('School', 'school-list')).pipe(
        tap(response => {
          if (response && response.length > 0) {
            return response as ISchool[];
          } else {
            return of(false);
          }
        })
      );
    }

    return this.http.Get<ISchool[]>('/schools')
      .pipe(
        tap(response => {
          if (response) {
            this.SetOfflineData('School', 'school-list', response);
            return response;
          } else {
            return null;
          }
        })
      );
  }
}
