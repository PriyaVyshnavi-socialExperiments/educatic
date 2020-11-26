import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IUser, Role } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-assessment-quizzes',
  templateUrl: './assessment-quizzes.page.html',
  styleUrls: ['./assessment-quizzes.page.scss'],
})
export class AssessmentQuizzesPage implements OnInit {
  currentUser: IUser;
  isStudent: boolean;
  
  constructor( private router: Router,
    private authenticationService: AuthenticationService,
    private alertController: AlertController,) { }

  ngOnInit() {
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

  NavigateToQuestions() {
    if(this.isStudent) {
      this.router.navigate([`assessment/1000/10001/student`]);
    } else {
      this.router.navigate(['assessment/questions']);
    }
  }

}
