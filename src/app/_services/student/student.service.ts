
import { Injectable, Injector } from '@angular/core';
import { HttpService } from '../http-client/http.client';
import { NetworkService } from '../network/network.service';
import { OfflineService } from '../offline/offline.service';
import { Guid } from 'guid-typescript';
import { IStudent, OfflineSyncURL } from '../../_models';
import { map, finalize, tap, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StudentService extends OfflineService {

  constructor(
    private http: HttpService,
    public injector: Injector,
    private network: NetworkService,
  ) {
    super(injector);
  }

  public SubmitStudent(studentInfo: IStudent) {
    if (!studentInfo.id) {
      studentInfo.id = Guid.create().toString();
    }
    return this.http.Post<Response>(OfflineSyncURL.Student, studentInfo)
      .pipe(
        map(response => {
          if (response) {
          }
          return response;
        }),
        finalize(() => {
          this.UpdateStudentOfflineList(studentInfo);
        })
      );
  }

  public GetStudents(schoolId: string, classId: string) {
    if (!this.network.IsOnline()) {
      return this.getOfflineStudents();
    } else {

      return this.http.Get<IStudent[]>(`/students/${schoolId}/${classId}`)
        .pipe(
          tap(response => {
            if (response) {
              this.SetOfflineData('Student', 'student-list', response);
              return response;
            } else {
              return null;
            }
          }),
          catchError(() => {
            return this.getOfflineStudents();
          })
        );
    }
  }

  private getOfflineStudents() {
    return from(this.GetOfflineData('Student', 'student-list')).pipe(
      tap(response => {
        if (response && response.length > 0) {
          return response as IStudent[];
        } else {
          return of(false);
        }
      })
    );
  }

  public GetImages(id) {

  }

  public UploadImage(blobData, name, ext) {
      return of();
  }

  public UploadImageFile(file: File) {
    return of();
  }

  public DeleteImage(id) {
    return of();
  }

  private UpdateStudentOfflineList(student: IStudent) {
    this.GetOfflineData('Student', 'student-list').then((data) => {
      let studentList = data as IStudent[];
      studentList = studentList.filter((obj) => {
        return obj.id !== student.id;
      });
      studentList.push(student);
      this.SetOfflineData('Student', 'student-list', studentList);
    });
  }
}
