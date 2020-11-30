import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-assessment-quizzes',
  templateUrl: './assessment-quizzes.page.html',
  styleUrls: ['./assessment-quizzes.page.scss'],
})
export class AssessmentQuizzesPage implements OnInit {

  constructor( private router: Router,
    private alertController: AlertController,) { }

  ngOnInit() {
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

  NavigateToQuestions() {
    this.router.navigate(['assessment/questions']);
  }

}
