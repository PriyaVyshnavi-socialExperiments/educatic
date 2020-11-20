import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-assessment-questions',
  templateUrl: './assessment-questions.page.html',
  styleUrls: ['./assessment-questions.page.scss'],
})
export class AssessmentQuestionsPage implements OnInit {

  constructor(private alertController: AlertController,
    private router: Router) { }

  ngOnInit() {
  }

  AddNewQuestion() {
    this.router.navigate(['assessment/question/add']);
  }

  ShareQuestions() {

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

}
