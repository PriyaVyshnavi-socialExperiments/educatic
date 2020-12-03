import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { IUser } from 'src/app/_models';
import { IAssessment, IQuestion } from 'src/app/_models/assessment';
import { AuthenticationService } from 'src/app/_services';
import { AssessmentService } from 'src/app/_services/assessment/assessment.service';
import { AssessmentSharePage } from '../assessment-share/assessment-share.page';

@Component({
  selector: 'app-assessment-questions',
  templateUrl: './assessment-questions.page.html',
  styleUrls: ['./assessment-questions.page.scss'],
})
export class AssessmentQuestionsPage implements OnInit {
  assessment: IAssessment;
  questions: IQuestion[] = [];
  currentUser: IUser;
  subjectName: string;

  constructor(private alertController: AlertController,
    private authenticationService: AuthenticationService,
    private assessmentService: AssessmentService,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private router: Router) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.subjectName = this.activatedRoute.snapshot.paramMap.get('subject');
      const assessmentId = this.activatedRoute.snapshot.paramMap.get('id');

      this.assessmentService.GetAssessments(this.currentUser.defaultSchool.id).subscribe((subjectWise) => {
        subjectWise.subscribe((subjectAssessments) => {
          const subjectWiseAssessments = subjectAssessments.find((a) => a.subjectName.toLowerCase() === this.subjectName);
          if(subjectWiseAssessments) {
            this.subjectName = subjectWiseAssessments.subjectName;
            this.assessment = subjectWiseAssessments.assessments?.find((a) => a.id === assessmentId) || {};
            if(this.assessment){
              console.log("this.assessment: ", this.assessment);
              this.questions = [...this.assessment?.assessmentQuestions]
            }
          }
        })
      })
    });
  }

  AddNewQuestion() {
    this.router.navigateByUrl('assessment/question/add', { state: { assessment: this.assessment } });
  }

  async confirmQuestionDelete() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: `<strong>Are you sure you want to delete question?</strong>`,
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

  public async ShareQuestions(contentId) {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: AssessmentSharePage,
        mode: 'ios',
        componentProps: { contentId }
      });
    await modal.present();
  }

}
