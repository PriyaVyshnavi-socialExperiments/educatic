import { Injectable, Injector } from '@angular/core';
import { OfflineService } from '../offline/offline.service';
import { HttpService } from '../http-client/http.client';
import { NetworkService } from '../network/network.service';
import { IClassRoom, OfflineSyncURL } from '../../_models';
import { Guid } from 'guid-typescript';
import { map, finalize, tap, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ClassRoomService extends OfflineService {

  constructor(
    private http: HttpService,
    public injector: Injector,
    private network: NetworkService,
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

  private UpdateClassRoomOfflineList(classRoom: IClassRoom) {
    this.GetOfflineData('ClassRoom', 'class-room-list').then((data) => {
      let classRoomList = data as IClassRoom[];
      classRoomList = classRoomList? classRoomList.filter((obj) => {
        return obj.classId !== classRoom.classId;
      }) : [];
      classRoomList.push(classRoom);
      this.SetOfflineData('ClassRoom', 'class-room-list', classRoomList);
    });
  }
}
