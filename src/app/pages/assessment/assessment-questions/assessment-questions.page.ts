import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AssessmentSharePage } from '../assessment-share/assessment-share.page';

@Component({
  selector: 'app-assessment-questions',
  templateUrl: './assessment-questions.page.html',
  styleUrls: ['./assessment-questions.page.scss'],
})
export class AssessmentQuestionsPage implements OnInit {

  constructor(private alertController: AlertController,
    private modalController: ModalController,
    private router: Router) { }

  ngOnInit() {
  }

  AddNewQuestion() {
    this.router.navigate(['assessment/question/add']);
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
