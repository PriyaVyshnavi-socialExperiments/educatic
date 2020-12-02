import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser, Role } from 'src/app/_models';
import { IAssessment, ISubjectAssessment } from 'src/app/_models/assessment';
import { AuthenticationService } from 'src/app/_services';
import { AssessmentService } from 'src/app/_services/assessment/assessment.service';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.page.html',
  styleUrls: ['./assessments.page.scss'],
})
export class AssessmentsPage implements OnInit {
  title = 'Assessments';
  currentUser: IUser;
  isStudent: boolean;
  assessments: ISubjectAssessment[] = [];

  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private assessmentService: AssessmentService) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.isStudent = this.currentUser.role === Role.Student;
      if (this.isStudent) {
        this.title = 'My Assessments';
      }
      this.assessmentService.GetAssessments(this.currentUser.defaultSchool.id).subscribe((subjectWise) => {
        subjectWise.subscribe((assessments) => {
          this.assessments = [...assessments];
          console.log("list: ", this.assessments);
        })
      })
    });
  }

  selectAssessment(assessment: ISubjectAssessment) {
    this.router.navigateByUrl(`assessment/quizzes`, { state: {SubjectAssessments: assessment } });
  }

}
