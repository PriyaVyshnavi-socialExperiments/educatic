import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { IUser } from 'src/app/_models';
import { IAssessment, IQuestion, IAssessmentShare } from 'src/app/_models/assessment';
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
  backURL = 'assessment/quizzes/';

  constructor(private alertController: AlertController,
    private authenticationService: AuthenticationService,
    private assessmentService: AssessmentService,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private toastController: ToastController,
    private router: Router) { }

  ngOnInit() {
   
  }

  ionViewWillEnter() {
    this.refresh();
  }

  refresh() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.subjectName = this.activatedRoute.snapshot.paramMap.get('subject');
      const assessmentId = this.activatedRoute.snapshot.paramMap.get('id');
      this.backURL = this.backURL + this.subjectName;
      setTimeout(() => {
      this.assessmentService.GetOfflineAssessments().subscribe((subjectWise) => {
        subjectWise.subscribe((subjectAssessments) => {
          const subjectWiseAssessments = subjectAssessments.find((a) => a.subjectName.toLowerCase() === this.subjectName);
          if (subjectWiseAssessments) {
            this.subjectName = subjectWiseAssessments.subjectName;
            this.assessment = subjectWiseAssessments.assessments?.find((a) => a.id === assessmentId) || {};
            if (this.assessment?.assessmentQuestions) {
              this.assessment.assessmentQuestions = this.assessment?.assessmentQuestions?.filter(q=>q.active);
              this.questions = [...this.assessment.assessmentQuestions]
            }
          }
        })
      });
    }, 300);
    });
  }

  AddQuestion() {
    this.router.navigateByUrl(`assessment/${this.subjectName}/${this.assessment.id}/question/add`);
  }

  UpdateQuestion(questionId: string) {
    this.router.navigateByUrl(`assessment/${this.subjectName}/${this.assessment.id}/question/update/${questionId}`);
  }

  async confirmQuestionDelete(questionId: string) {
    const question = this.questions.find(q=>q.id === questionId);
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
            question.active = false;
            this.assessmentService.CreateUpdateAssessmentQuestion(question, this.assessment.id, this.subjectName).subscribe((res) => {
              this.presentToast('Assessment question deleted successfully.', 'success');
              this.refresh();
            })
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
      });

    modal.onDidDismiss()
      .then((modalData: any) => {
        const assessmentShare = {
          schoolId: modalData.data.schoolId,
          classId: modalData.data.classId,
          assessmentId: this.assessment.id
        } as IAssessmentShare
        this.assessmentService.AssessmentShare(assessmentShare).subscribe((res) => {
          this.presentToast('Assessment share successfully.', 'success');
        })
      });
    await modal.present();
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
