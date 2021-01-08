
import { Injectable, Injector } from '@angular/core';
import { HttpService } from '../http-client/http.client';
import { NetworkService } from '../network/network.service';
import { OfflineService } from '../offline/offline.service';
import { Guid } from 'guid-typescript';
import { IStudent, OfflineSyncURL, IUser } from '../../_models';
import { map, finalize, tap, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { IStudentPhoto } from '../../_models/student-photos';
import { BlobUploadsViewStateService } from '../../_services/azure-blob/blob-uploads-view-state.service';
import { BlobSharedViewStateService } from '../../_services/azure-blob/blob-shared-view-state.service';
import { IQueueMessage } from 'src/app/_models/queue-message';
import { BlobDownloadsViewStateService } from '../azure-blob/blob-downloads-view-state.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})

export class StudentService extends OfflineService {

  constructor(
    private http: HttpService,
    public injector: Injector,
    private network: NetworkService,
    private blobUpload: BlobUploadsViewStateService,
    private blobShared: BlobSharedViewStateService,
    private blobDownload: BlobDownloadsViewStateService,
    private auth: AuthenticationService,

  ) {
    super(injector);
  }

  public SubmitStudent(studentInfo: IStudent) {
    if (!studentInfo.id) {
      studentInfo.id = Guid.create().toString();
    }
    return this.http.Post<Response>(OfflineSyncURL.Student, studentInfo)
      .pipe(
        map((response: any) => {
          response.studentId = studentInfo.id;
          return response;
        }),
        finalize(() => {
          this.UpdateStudentOffline(studentInfo);
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

  public async UploadStudentPhoto(studentPhoto: IStudentPhoto) {
    await this.GetOfflineData('StudentPhotos', studentPhoto.id).then((data) => {
      let studentPhotos = data ? data as IStudentPhoto[] : [];
      studentPhotos = studentPhotos.filter((obj) => {
        return obj.sequenceId !== studentPhoto.sequenceId;
      });
      studentPhotos.push(studentPhoto);
      this.SetOfflineData('StudentPhotos', studentPhoto.id, studentPhotos);
    });
  }

  public GetStudentPhotos(studentId: string) {
    return from(this.GetOfflineData('Student', studentId)).pipe(
      tap(data => {
        if (data && data.length > 0) {
          return data as IStudentPhoto[];
        } else {
          return of(false);
        }
      })
    );
  }

  public GetStudentPhoto(imageURL) {
    this.blobShared.setContainer$ = 'students';
    this.blobShared.resetSasToken$ = true;
    return this.blobDownload.downloadFile(imageURL);
  }

  public UploadImageFile(studentBlobData) {
    this.blobShared.setContainer$ = 'students';
    this.blobShared.resetSasToken$ = true;
    return this.blobUpload.uploadFile(studentBlobData);
  }

  public QueueBlobMessage(queueData: IQueueMessage) {
    return this.http.Post<any>('/cognitive/train/student', queueData);
  }

  public DeleteImage(id) {
    return of();
  }

  public UpdateStudentOffline(student: IStudent, schoolId?: string, classId?: string, studentId?: string) {
    return this.GetOfflineData('User', 'current-user').then((data) => {
      const user = data as IUser;
      const school = user.schools.find((s) => s.id === (student? student.schoolId: schoolId));
      const classRoom = school.classRooms.find((s) => s.classId === (student? student.classId: classId));

      const classRoomList = school.classRooms.filter((cr) => {
        return cr.classId !== classRoom.classId;
      });

      const studentList = classRoom.students.filter((st) => {
        return st.id !== (student ? student.id : studentId);
      });

      if (student) {
        studentList.unshift(student);

      }
      classRoom.students = studentList;
      classRoomList.unshift(classRoom);

      school.classRooms = classRoomList;
      this.auth.RefreshSchools(user.schools, school);
    });
  }

  public DeleteStudent(schoolId: string, classId: string,studentId: string) {
    return this.http.Get<Response>(`/student/${studentId}/delete`)
      .pipe(
        map(response => {
          return response;
        }),
        finalize(() => {
          this.UpdateStudentOffline(undefined, schoolId, classId, studentId);
        })
      );
  }
}
