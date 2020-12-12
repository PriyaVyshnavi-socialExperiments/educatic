import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { IUser, Role } from 'src/app/_models';
import { IAssessment, ISubjectAssessment } from 'src/app/_models/assessment';
import { ICourseContentCategory } from 'src/app/_models/course-content-category';
import { AuthenticationService } from 'src/app/_services';
import { AssessmentService } from 'src/app/_services/assessment/assessment.service';

@Component({
  selector: 'app-assessment-quizzes',
  templateUrl: './assessment-quizzes.page.html',
  styleUrls: ['./assessment-quizzes.page.scss'],
})
export class AssessmentQuizzesPage implements OnInit {
  currentUser: IUser;
  subjectName: string;
  isStudent: boolean;
  assessments: IAssessment[] = [];
  subjectAssessment: ISubjectAssessment[] = [];

  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private assessmentService: AssessmentService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.isStudent = this.currentUser.role === Role.Student;
      this.subjectName = this.activatedRoute.snapshot.paramMap.get('subject');

      this.assessmentService.GetAssessments(this.currentUser.defaultSchool.id).subscribe((subjectWise) => {
        subjectWise.subscribe((assessments) => {
          this.subjectAssessment = [...assessments];
          const subjectWiseAssessments = this.subjectAssessment.find((a) => a.subjectName.toLowerCase() === this.subjectName);
          if(subjectWiseAssessments) {
            this.subjectName = subjectWiseAssessments.subjectName;
            this.assessments = [...subjectWiseAssessments.assessments];
          }
        })
      })

      if (!this.subjectAssessment) {
        this.router.navigateByUrl('/assessments');
      }
    });
  }

  AddNewCategory() {

  }

  async confirmQuizDelete(assessment: IAssessment) {
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
            assessment.active = false;
            this.assessmentService.CreateUpdateAssessment(assessment).subscribe((res) => {
              this.presentToast('Assessment quiz deleted successfully.', 'success');
            })
          }
        }
      ]
    });

    await alert.present();
  }

  AddNewQuiz() {
    this.router.navigateByUrl(`assessment/quiz/${this.subjectName}/add`);
  }

  UpdateQuiz(assessmentQuiz: IAssessment) {
    this.router.navigateByUrl(`assessment/quiz/${this.subjectName}/${assessmentQuiz.id}/update`, { state: { assessmentQuiz } });
  }

  NavigateToQuestions(assessment: IAssessment) {
    if (this.isStudent) {
      this.router.navigateByUrl(`assessment/${this.subjectName}/${assessment.id}/student`, { state: { assessment } });
    } else {
      this.router.navigateByUrl(`assessment/${this.subjectName}/${assessment.id}/questions`);
    }
  }

  private async presentToast(msg, type) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 3000,
      color: type,
      buttons: [{
        text: 'Close',
        role: 'cancel',
      }
      ]
    });
    toast.present();
  }

}
