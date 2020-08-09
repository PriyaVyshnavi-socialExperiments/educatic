import { Injectable, Injector } from '@angular/core';
import { HttpService } from '../http-client/http.client';
import { NetworkService } from '../network/network.service';
import { OfflineService } from '../offline/offline.service';
import { Guid } from 'guid-typescript';
import { ITeacher, OfflineSyncURL } from '../../_models';
import { map, finalize, tap, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TeacherService extends OfflineService {

  constructor(
    private http: HttpService,
    public injector: Injector,
    private network: NetworkService,
  ) {
    super(injector);
  }

  public SubmitTeacher(teacherInfo: ITeacher) {
    if (!teacherInfo.id) {
      teacherInfo.id = Guid.create().toString();
    }
    return this.http.Post<Response>(OfflineSyncURL.Teacher, teacherInfo)
      .pipe(
        map(response => {
          if (response) {
          }
          return response;
        }),
        finalize(() => {
          this.UpdateTeacherOfflineList(teacherInfo);
        })
      );
  }

  public GetTeachers() {
    if (!this.network.IsOnline()) {
      return this.getOfflineTeachers();
    } else {

      return this.http.Get<ITeacher[]>('/teachers')
        .pipe(
          tap(response => {
            if (response) {
              this.SetOfflineData('Teacher', 'teacher-list', response);
              return response;
            } else {
              return null;
            }
          }),
          catchError(() => {
            return this.getOfflineTeachers();
          })
        );
    }
  }

  private getOfflineTeachers() {
    return from(this.GetOfflineData('Teacher', 'teacher-list')).pipe(
      tap(response => {
        if (response && response.length > 0) {
          return response as ITeacher[];
        } else {
          return of(false);
        }
      })
    );
  }

  private UpdateTeacherOfflineList(teacher: ITeacher) {
    this.GetOfflineData('Teacher', 'teacher-list').then((data) => {
      let teacherList = data as ITeacher[];
      teacherList = teacherList.filter((obj) => {
        return obj.id !== teacher.id;
      });
      teacherList.push(teacher);
      this.SetOfflineData('Teacher', 'teacher-list', teacherList);
    });
  }
}
