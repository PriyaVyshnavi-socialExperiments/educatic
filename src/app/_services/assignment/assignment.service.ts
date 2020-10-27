import { Injectable, Injector } from '@angular/core';
import { forkJoin } from 'rxjs';
import { IAssignment, IStudentAssignment } from 'src/app/_models/assignment';
import { ICourseContentCategory } from 'src/app/_models/course-content-category';
import { BlobSharedViewStateService } from '../azure-blob/blob-shared-view-state.service';
import { BlobUploadsViewStateService } from '../azure-blob/blob-uploads-view-state.service';
import { HttpService } from '../http-client/http.client';
import { OfflineService } from '../offline/offline.service';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService extends OfflineService {

  constructor(
    private http: HttpService,
    public injector: Injector,
    private blobUpload: BlobUploadsViewStateService,
    private blobShared: BlobSharedViewStateService,
  ) {
    super(injector);
  }

  public AssignmentTeacher(assignment: IAssignment, file: File) {
    return forkJoin([this.UploadAssignment(file), this.Teacher(assignment)]);
  }

  public AssignmentStudent(assignment: IStudentAssignment, file: File) {
    return forkJoin([this.UploadAssignment(file), this.Student(assignment)]);
  }

  public AddOfflineSubjects(subjects: ICourseContentCategory[]) {
    return this.GetOfflineData('subjects', 'subjects').then((data: ICourseContentCategory[]) => {
      subjects = [...(data || []), ...subjects];
      subjects = [...new Map(subjects.map(item => [item.name, item])).values()]
      this.SetOfflineData('subjects', 'subjects', subjects);
    });
  }

  public GetOfflineSubjects() {
    return this.GetOfflineData('subjects', 'subjects').then((data: ICourseContentCategory[]) => data);
  }

  private UploadAssignment(assignment: File) {
    this.blobShared.setContainer$ = 'assignments';
    this.blobShared.resetSasToken$ = true;
    return this.blobUpload.uploadFile(assignment);
  }

  private Teacher(assignment: IAssignment) {
    return this.http.Post<Response>('/assignment/teacher', assignment);
  }

  private Student(assignment: IStudentAssignment) {
    return this.http.Post<Response>('/assignment/student', assignment);
  }

}
