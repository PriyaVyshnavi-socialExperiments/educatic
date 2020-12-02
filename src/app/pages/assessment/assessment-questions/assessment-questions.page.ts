import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { IAssessment } from 'src/app/_models/assessment';
import { AssessmentSharePage } from '../assessment-share/assessment-share.page';

@Component({
  selector: 'app-assessment-questions',
  templateUrl: './assessment-questions.page.html',
  styleUrls: ['./assessment-questions.page.scss'],
})
export class AssessmentQuestionsPage implements OnInit {
  assessment: IAssessment;

  constructor(private alertController: AlertController,
    private modalController: ModalController,
    private router: Router) { }

  ngOnInit() {
    this.assessment = history.state.assessment as IAssessment;
    if(!this.assessment) {
      this.router.navigateByUrl('/assessments');
    }
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
