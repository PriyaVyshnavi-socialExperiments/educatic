import { Injectable, Injector } from '@angular/core';
import { HttpService } from '../http-client/http.client';
import { NetworkService } from '../network/network.service';
import { OfflineService } from '../offline/offline.service';
import { Guid } from 'guid-typescript';
import { ITeacher, OfflineSyncURL, IUser } from '../../_models';
import { map, finalize, tap, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})

export class TeacherService extends OfflineService {

  constructor(
    private http: HttpService,
    public injector: Injector,
    private network: NetworkService,
    private auth: AuthenticationService
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

  public GetTeachers(schoolId: string) {
    if (!this.network.IsOnline()) {
      return this.getOfflineTeachers();
    } else {

      return this.http.Get<ITeacher[]>(`/teachers/${schoolId}`)
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

  public DeleteTeacher(schoolId: string, teacherId: string) {
    return this.http.Get<Response>(`/teacher/${teacherId}/delete`)
      .pipe(
        map(response => {
          return response;
        }),
        finalize(() => {
          this.UpdateTeacherOfflineList(undefined, schoolId, teacherId);
        })
      );
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

  private UpdateTeacherOfflineList(teacher: ITeacher, schoolId?: string, teacherId?: string) {
    return this.GetOfflineData('User', 'current-user').then((data) => {
      const user = data as IUser;
      const school = user.schools.find((s) => s.id === (teacher ? teacher.schoolId : schoolId));
      const teacherList = school.teachers.filter((ts) => {
        return ts.id !== (teacher ? teacher.id : teacherId);
      });
      if (teacher) {
        teacherList.unshift(teacher);
      }
      school.teachers = teacherList;
      this.auth.RefreshSchools(user.schools, school);
    });
  }
}
