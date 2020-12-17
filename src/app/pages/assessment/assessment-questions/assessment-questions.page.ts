import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { IUser } from 'src/app/_models';
import { IAssessment, IQuestion } from 'src/app/_models/assessment';
import { IAssessmentShare } from 'src/app/_models/assessment-share';
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
    private toastController: ToastController,
    private router: Router) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.subjectName = this.activatedRoute.snapshot.paramMap.get('subject');
      const assessmentId = this.activatedRoute.snapshot.paramMap.get('id');

      this.assessmentService.GetOfflineAssessments().subscribe((subjectWise) => {
        subjectWise.subscribe((subjectAssessments) => {
          const subjectWiseAssessments = subjectAssessments.find((a) => a.subjectName.toLowerCase() === this.subjectName);
          if (subjectWiseAssessments) {
            this.subjectName = subjectWiseAssessments.subjectName;
            this.assessment = subjectWiseAssessments.assessments?.find((a) => a.id === assessmentId) || {};
            if (this.assessment) {
              this.questions = [...this.assessment?.assessmentQuestions]
            }
          }
        })
      });
    });
  }

  AddQuestion() {
    this.router.navigateByUrl(`assessment/${this.subjectName}/${this.assessment.id}/question/add`);
  }

  UpdateQuestion(questionId: string) {
    this.router.navigateByUrl(`assessment/${this.subjectName}/${this.assessment.id}/question/update/${questionId}`);
  }

  async confirmQuestionDelete(questionId: string) {
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
      });

    modal.onDidDismiss()
      .then((modalData: any) => {
        const assessmentShare = {
          schoolId: modalData.data.schoolId,
          classId: modalData.data.classId,
          assessmentId: this.assessment.id
        } as IAssessmentShare
        this.assessmentService.AssessmentShare(assessmentShare).subscribe((res) => {
          this.SharedToast();
        })
      });
    await modal.present();
  }

  private async SharedToast() {
    const toast = await this.toastController.create({
      message: 'Assessment share successfully.',
      position: 'bottom',
      duration: 5000,
      color: 'success',
      buttons: [{
        text: 'Close',
        role: 'cancel',
      }
      ]
    });
    toast.present();
  }
}
