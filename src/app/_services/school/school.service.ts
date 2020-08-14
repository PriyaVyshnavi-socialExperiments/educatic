import { Injectable, Injector, EventEmitter } from '@angular/core';
import { HttpService } from '../http-client/http.client';
import { OfflineService } from '../offline/offline.service';
import { tap, finalize, map, catchError } from 'rxjs/operators';
import { ISchool, OfflineSyncURL } from '../../_models';
import { from, of } from 'rxjs';
import { NetworkService } from '../../_services/network/network.service';
import { Guid } from 'guid-typescript';
import { IPowerBIConfig } from 'src/app/_models/power-bi-config';

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

  public SubmitSchool(schoolInfo: ISchool) {
    if (!schoolInfo.id) {
      schoolInfo.id = Guid.create().toString();
    }
    return this.http.Post<Response>(OfflineSyncURL.School, schoolInfo)
      .pipe(
        map(response => {
          if (response) {
          }
          return response;
        }),
        finalize(() => {
          this.UpdateSchoolOfflineList(schoolInfo);
        })
      );
  }

  public GetSchools() {
    if (!this.network.IsOnline()) {
      return this.getOfflineSchools();
    } else {

      return this.http.Get<ISchool[]>('/schools')
        .pipe(
          tap(response => {
            if (response) {
              this.SetOfflineData('School', 'school-list', response);
              return response;
            } else {
              return null;
            }
          }),
          catchError(() => {
            return this.getOfflineSchools();
          })
        );
    }
  }

  public GetPowerBIConfig() {
      return this.http.Get<IPowerBIConfig[]>('/powerbi/token')
        .pipe(
          tap(response => {
            return response;
          })
        );
  }

  private getOfflineSchools() {
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

  /** Set the school details which will emit the the current item to display in right side menu */
  public setSchoolDetails(school) {
    this.detailsSchool.emit(school);
  }

  /** Will returns the school details to display in right side menu */
  public getSchoolDetails() {
    return this.detailsSchool;
  }

  private UpdateSchoolOfflineList(school: ISchool) {
    this.GetOfflineData('School', 'school-list').then((data) => {
      let schoolList = data as ISchool[];
      schoolList = schoolList.filter((obj) => {
        return obj.id !== school.id;
      });
      schoolList.push(school);
      this.SetOfflineData('School', 'school-list', schoolList);
    });
  }

}
