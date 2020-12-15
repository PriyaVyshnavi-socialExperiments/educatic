import { Injectable, Injector } from '@angular/core';
import { Guid } from 'guid-typescript';
import { concat, forkJoin, from, of } from 'rxjs';
import { catchError, finalize, groupBy, map, mergeMap, reduce, tap, toArray } from 'rxjs/operators';
import { IAssignment, IStudentAssignment, ISubjectAssignmentList } from 'src/app/_models/assignment';
import { ICourseContentCategory } from 'src/app/_models/course-content-category';
import { BlobSharedViewStateService } from '../azure-blob/blob-shared-view-state.service';
import { BlobUploadsViewStateService } from '../azure-blob/blob-uploads-view-state.service';
import { HttpService } from '../http-client/http.client';
import { NetworkService } from '../network/network.service';
import { OfflineService } from '../offline/offline.service';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService extends OfflineService {

  constructor(
    private http: HttpService,
    public injector: Injector,
    private network: NetworkService,
    private blobUpload: BlobUploadsViewStateService,
    private blobShared: BlobSharedViewStateService,
  ) {
    super(injector);
  }

  public AssignmentTeacher(assignment: IAssignment, file: File) {
    return concat(this.UploadAssignment(file), this.CreateUpdateAssignment(assignment));
  }

  public AssignmentStudent(assignment: IStudentAssignment, file: File) {
    return concat(this.UploadAssignment(file), this.SubmitAssignment(assignment));
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

  public GetAssignments(schoolId: string, classId: string) {
    if (!this.network.IsOnline()) {
      return this.getOfflineAssignments();
    } else {

      return this.http.Get<IAssignment[]>(`/assignment/${schoolId}/${classId}`)
        .pipe(
          tap(response => {
            if (response) {
              this.SetOfflineData('Assignments', 'assignments', response);
              return response;
            } else {
              return null;
            }
          }),
          catchError(() => {
            return this.getOfflineAssignments();
          })
        );
    }
  }

  public GetSubjectWiseAssignments(assignments: IAssignment[]) {
    return from(assignments)
      .pipe(
        groupBy(a => a.subjectName),
        mergeMap(group => group
          .pipe(
            reduce((asm, cur) => {
              asm.assignment.push(cur);
              asm.length = asm.assignment.length;
              return asm;
            },
              { key: group.key, assignment: [], length: 0 } as ISubjectAssignmentList
            )
          )
        ),
        toArray()
      )
  }

  private UploadAssignment(assignment: File) {
    this.blobShared.setContainer$ = 'assignments';
    this.blobShared.resetSasToken$ = true;
    return this.blobUpload.uploadFile(assignment);
  }

  public CreateUpdateAssignment(assignment: IAssignment) {
    if (!assignment.id) {
      assignment.id = Guid.create().toString();
    }
    return this.http.Post<Response>('/assignment/create', assignment)
      .pipe(
        map(response => {
          return response;
        }),
        finalize(() => {
          this.UpdateAssignmentOfflineList(assignment);
        })
      );
  }

  private SubmitAssignment(assignment: IStudentAssignment) {
    return this.http.Post<Response>('/assignment/submit', assignment);
  }

  private getOfflineAssignments() {
    return from(this.GetOfflineData('Assignments', 'assignments')).pipe(
      tap(response => {
        if (response && response.length > 0) {
          return response as IAssignment[];
        } else {
          return of(false);
        }
      })
    );
  }

  private async UpdateAssignmentOfflineList(content: IAssignment, contentId?: string) {
    const data = await this.GetOfflineData('Assignments', 'assignments');
    const courseContents = data ? data as IAssignment[] : [];
    const courseContent = courseContents.find((s) => s.id === content.id);
    const courseContentList = courseContents.filter((cc) => {
      return cc.id !== (courseContent ? courseContent.id : contentId);
    });
    if (content) {
      courseContentList.unshift(content);
    }
    await this.SetOfflineData('Assignments', 'assignments', courseContentList);
    // this.auth.currentUser.subscribe(async (currentUser) => {
    //   currentUser.courseContent = courseContentList;
    //   await this.SetOfflineData('CourseContent', 'course-content', courseContentList);
    // });
  }

}
