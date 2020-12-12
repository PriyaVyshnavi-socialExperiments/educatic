import { Injectable, Injector } from '@angular/core';
import { Guid } from 'guid-typescript';
import { from } from 'rxjs';
import { catchError, finalize, groupBy, map, mergeMap, reduce, tap, toArray } from 'rxjs/operators';
import { IAssessment, ISubjectAssessment } from 'src/app/_models/assessment';
import { HttpService } from '../http-client/http.client';
import { NetworkService } from '../network/network.service';
import { OfflineService } from '../offline/offline.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService extends OfflineService {

  constructor(
    private http: HttpService,
    public injector: Injector,
    private network: NetworkService,
  ) {
    super(injector);
  }


  public CreateUpdateAssessment(assessment: IAssessment) {
    if (!assessment.id) {
      assessment.id = Guid.create().toString();
    }
    return this.http.Post<Response>('/assessment/update', assessment)
      .pipe(
        map(response => {
          return response;
        }),
        finalize(() => {
          //this.UpdateAssignmentOfflineList(assignment);
        })
      );
  }

  public GetAssessments(schoolId: string) {
    // if (!this.network.IsOnline()) {
    //   return this.getOfflineAssignments();
    // } else {

      return this.http.Get<IAssessment[]>(`/assessments/${schoolId}`)
        .pipe(
          map(res => this.GetSubjectWiseAssessments(res)),
          tap(response => {
            if (response) {
              //this.SetOfflineData('Assignments', 'assignments', response);
              return response;
            } else {
              return null;
            }
          }),
          // catchError(() => {
          //   return this.getOfflineAssignments();
          // })
        );
    // }
  }
  
  public GetSubjectWiseAssessments(assessments: IAssessment[]) {
    return from(assessments)
      .pipe(
        groupBy(a => a.subjectName.toLowerCase()),
        mergeMap(group => group
          .pipe(
            reduce((asm, cur) => {
              asm.assessments.push(cur);
              asm.length = asm.assessments.length;
              return asm;
            },
              { key: group.key, assessments: [], length: 0 } as ISubjectAssessment
            )
          )
        ),
        toArray()
      )
  }
}
