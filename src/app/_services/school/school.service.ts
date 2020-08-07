import { Injectable, Injector, EventEmitter } from '@angular/core';
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
  public detailsSchool: EventEmitter<ISchool> = new EventEmitter();
  
  constructor(
    private http: HttpService,
    public injector: Injector,
    private network: NetworkService,
  ) {
    super(injector);
  }

  public GetSchools() {
    if (!this.network.IsOnline()) {
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

  /** Set the school details which will emit the the current item to display in right side menu */
  public setSchoolDetails( school ) {
    this.detailsSchool.emit( school );
 }

 /** Will returns the school details to display in right side menu */
 public getSchoolDetails() {
     return this.detailsSchool;
 }
}
