import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser, Role } from 'src/app/_models';
import { IAssessment, ISubjectAssessment } from 'src/app/_models/assessment';
import { ICourseContentCategory } from 'src/app/_models/course-content-category';
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
  courseCategory: ICourseContentCategory[] = [];

  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private assessmentService: AssessmentService) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.isStudent = this.currentUser.role === Role.Student;
      if (this.isStudent) {
        this.title = 'My Assessments';
      }

      this.courseCategory = this.currentUser.assessmentCategory.map((cat, index) => {
        return { id: index.toString(), name: cat.toLowerCase() } as ICourseContentCategory;
      });

      this.assessmentService.SetOfflineData('Assessment', 'category', this.courseCategory);

      this.assessmentService.GetAssessments(this.currentUser.defaultSchool.id, this.currentUser.classId, this.currentUser.id)
        .subscribe((subjectWise) => {
          subjectWise.subscribe((assessments) => {
            this.assessments = [...assessments];
            // this.courseCategory = this.assessments.map((cat, index) => {
            //   return { id: index.toString(), name: cat.subjectName.toLowerCase() } as ICourseContentCategory;
            // })
            // this.assessmentService.SetOfflineData('Assessment', 'category', this.courseCategory);
          })
        })
    });
  }

  selectAssessment(subject: string) {
    setTimeout(() => {
      this.router.navigateByUrl(`assessment/quizzes/${subject}`);
    }, 10);
  }

}
