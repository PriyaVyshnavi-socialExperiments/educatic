import { Injectable, Injector } from '@angular/core';
import { OfflineService } from '../offline/offline.service';
import { HttpService } from '../http-client/http.client';
import { NetworkService } from '../network/network.service';
import { IClassRoom, OfflineSyncURL, IUser } from '../../_models';
import { Guid } from 'guid-typescript';
import { map, finalize, tap, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})

export class ClassRoomService extends OfflineService {

  constructor(
    private http: HttpService,
    public injector: Injector,
    private network: NetworkService,
    private auth: AuthenticationService,
  ) {
    super(injector);
  }

  public SubmitClassRoom(classRoomInfo: IClassRoom) {
    if (!classRoomInfo.classId) {
      classRoomInfo.classId = Guid.create().toString();
    }
    return this.http.Post<any>(OfflineSyncURL.ClassRoom, classRoomInfo)
      .pipe(
        map(response => {
          return response;
        }),
        finalize(() => {
          this.UpdateClassRoomOfflineList(classRoomInfo);
        })
      );
  }

  public GetClassRooms(schoolId: string) {
    if (!this.network.IsOnline()) {
      return this.getOfflineClassRooms();
    } else {

      return this.http.Get<IClassRoom[]>(`/class-rooms/${schoolId}`)
        .pipe(
          tap(response => {
            if (response) {
              this.SetOfflineData('ClassRoom', 'class-room-list', response);
              return response;
            } else {
              return null;
            }
          }),
          catchError(() => {
            return this.getOfflineClassRooms();
          })
        );
    }
  }

  public DeleteClassRoom(schoolId: string, classRoomId: string) {
    return this.http.Get<Response>(`/class-room/${classRoomId}/delete`)
      .pipe(
        map(response => {
          return response;
        }),
        finalize(() => {
          this.UpdateClassRoomOfflineList(undefined, schoolId, classRoomId);
        })
      );
  }

  private getOfflineClassRooms() {
    return from(this.GetOfflineData('ClassRoom', 'class-room-list')).pipe(
      tap(response => {
        if (response && response.length > 0) {
          return response as IClassRoom[];
        } else {
          return of(false);
        }
      })
    );
  }

  private UpdateClassRoomOfflineList(classRoom: IClassRoom, schoolId?: string, classRoomId?: string) {
    return this.GetOfflineData('User', 'current-user').then((data) => {
      const user = data as IUser;
      const school = user.schools.find((s) => s.id === (classRoom? classRoom.schoolId : schoolId));
      const classRoomList = school.classRooms.filter((cs) => {
        return cs.classId !== (classRoom ? classRoom.classId : classRoomId);
      });

      if (classRoom) {
        classRoomList.unshift(classRoom);
      }

      school.classRooms = classRoomList;
      this.auth.RefreshSchools(user.schools, school);
    });
  }

}
