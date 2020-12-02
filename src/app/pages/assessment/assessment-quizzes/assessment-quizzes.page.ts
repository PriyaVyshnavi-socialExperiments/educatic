import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IUser, Role } from 'src/app/_models';
import { IAssessment, ISubjectAssessment } from 'src/app/_models/assessment';
import { AuthenticationService } from 'src/app/_services';
import { AssessmentService } from 'src/app/_services/assessment/assessment.service';

@Component({
  selector: 'app-assessment-quizzes',
  templateUrl: './assessment-quizzes.page.html',
  styleUrls: ['./assessment-quizzes.page.scss'],
})
export class AssessmentQuizzesPage implements OnInit {
  currentUser: IUser;
  isStudent: boolean;
  subjectAssessment: ISubjectAssessment;

  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private assessmentService: AssessmentService,
    private alertController: AlertController,) { }

  ngOnInit() {
    this.subjectAssessment = history.state.SubjectAssessments as ISubjectAssessment;
    if (!this.subjectAssessment) {
      this.router.navigateByUrl('/assessments');
    }
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.isStudent = this.currentUser.role === Role.Student;
    });
  }

  AddNewCategory() {

  }

  async confirmQuizDelete() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: `<strong>Are you sure you want to delete quiz?</strong>`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Okay',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }

  AddNewQuiz() {
    this.router.navigate(['assessment/quiz/add']);
  }

  NavigateToQuestions(assessment: IAssessment) {
    if (this.isStudent) {
      this.router.navigate([`assessment/1000/10001/student`]);
    } else {
      this.router.navigateByUrl('assessment/questions', { state: { assessment } });
    }
  }

}
