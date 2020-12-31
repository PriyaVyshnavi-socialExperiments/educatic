import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
import { groupBy, mergeMap, reduce, toArray } from 'rxjs/operators';
import { IUser } from 'src/app/_models';
import { IAnswer, IAssessment, IClassAssessment, IStudentAssessment } from 'src/app/_models/assessment';
import { AuthenticationService } from 'src/app/_services';
import { AssessmentService } from 'src/app/_services/assessment/assessment.service';

@Component({
  selector: 'app-assessment-solved',
  templateUrl: './assessment-solved.page.html',
  styleUrls: ['./assessment-solved.page.scss'],
})
export class AssessmentSolvedPage implements OnInit {

  assessment: IAssessment;
  studentAssessments: IClassAssessment[] = [];
  currentUser: IUser;
  subjectName: string;
  backURL = 'assessment/quizzes/';

  constructor(
    private authenticationService: AuthenticationService,
    private assessmentService: AssessmentService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.subjectName = this.activatedRoute.snapshot.paramMap.get('subject');
      const assessmentId = this.activatedRoute.snapshot.paramMap.get('id');
      this.backURL = this.backURL + this.subjectName;
      this.assessmentService.GetOfflineAssessments().subscribe((subjectWise) => {
        subjectWise.subscribe((subjectAssessments) => {
          const subjectWiseAssessments = subjectAssessments.find((a) => a.subjectName.toLowerCase() === this.subjectName);
          if (subjectWiseAssessments) {
            this.subjectName = subjectWiseAssessments.subjectName;
            this.assessment = subjectWiseAssessments.assessments?.find((a) => a.id === assessmentId) || {};
            if (this.assessment) {
              this.GetClassWiseStudentAssessments(this.assessment.studentAssessments).subscribe((a) => {
                this.studentAssessments = [...a]
              });
            }
          }
        })
      });
    });
  }

  public getClassName(classId: string) {
    const classRoom = this.currentUser.defaultSchool.classRooms.find((c) => c.classId === classId);
    return `${classRoom.classRoomName} - ${classRoom.classDivision}`;
  }

  public getAverageAttempts(answers: IAnswer[]) {
    return answers.map((a) => a.attempts).reduce((a, value) => a + value, 0);
  }

  private GetClassWiseStudentAssessments(studentAssessments: IStudentAssessment[]) {
    return from(studentAssessments)
      .pipe(
        groupBy(a => a.classId),
        mergeMap(group => group
          .pipe(
            reduce((asm, cur) => {
              asm.studentAssessments.push(cur);
              asm.length = asm.studentAssessments.length;
              return asm;
            },
              { classId: group.key, studentAssessments: [], length: 0 } as IClassAssessment
            )
          )
        ),
        toArray()
      );
  }

}
