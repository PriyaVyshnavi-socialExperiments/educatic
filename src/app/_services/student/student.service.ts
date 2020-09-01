
import { Injectable, Injector } from '@angular/core';
import { HttpService } from '../http-client/http.client';
import { NetworkService } from '../network/network.service';
import { OfflineService } from '../offline/offline.service';
import { Guid } from 'guid-typescript';
import { IStudent, OfflineSyncURL } from '../../_models';
import { map, finalize, tap, catchError} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { IStudentPhoto } from '../../_models/student-photos';
import { BlobUploadsViewStateService } from '../../_services/azure-blob/blob-uploads-view-state.service';
import { BlobSharedViewStateService } from '../../_services/azure-blob/blob-shared-view-state.service';
import { IQueueMessage } from 'src/app/_models/queue-message';

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

  public UploadImageFile(studentBlobData) {
    this.blobShared.setContainer$ = 'students';
    this.blobShared.resetSasToken$ = true;
    return this.blobUpload.uploadFile(studentBlobData);
  }

  public QueueBlobMessage(queueData: IQueueMessage) {
    return this.http.Post<any>('/queue/message', queueData);
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
