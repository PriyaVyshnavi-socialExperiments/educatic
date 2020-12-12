import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { IUser } from 'src/app/_models';
import { IAssessment } from 'src/app/_models/assessment';
import { ICourseContentCategory } from 'src/app/_models/course-content-category';
import { AuthenticationService } from 'src/app/_services';
import { AssessmentService } from 'src/app/_services/assessment/assessment.service';
import { CourseCategoryPage } from '../../courses/course-category/course-category.page';

@Component({
  selector: 'app-assessment-quiz-add',
  templateUrl: './assessment-quiz-add.page.html',
  styleUrls: ['./assessment-quiz-add.page.scss'],
})
export class AssessmentQuizAddPage implements OnInit {
  @ViewChild('documentEditForm') documentEditForm: FormGroupDirective;

  courseCategory: ICourseContentCategory[] = [];
  quizForm: FormGroup;
  currentUser: IUser;
  quizAssessment: IAssessment;

  constructor(private formBuilder: FormBuilder,
    private modalController: ModalController,
    private assessmentService: AssessmentService,
    private authenticationService: AuthenticationService,
    public router: Router,
    private toastController: ToastController) { }

  ngOnInit() {
    this.quizAssessment = history.state.assessmentQuiz as IAssessment;
    this.quizForm = this.formBuilder.group({
      quizTitle: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      quizDescription: new FormControl('', [
        Validators.required,
        Validators.maxLength(1000),
      ]),
      quizCategory: new FormControl('', [
        Validators.required,
      ]),
    });

    this.authenticationService.currentUser?.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      if(this.quizAssessment) {
        this.quizForm.setValue({
          quizTitle: this.quizAssessment.assessmentTitle,
          quizDescription: this.quizAssessment.assessmentDescription,
          quizCategory: this.quizAssessment.subjectName
        });
      }
      this.assessmentService.GetOfflineData('Assessment', 'category').then((data) => {
        this.courseCategory = data as ICourseContentCategory[];
      });
    });
  }

  get f() {
    return this.quizForm.controls
  }

  SubmitQuiz() {
    if (this.quizForm.invalid) {
      return;
    } else {
      const assessment = {
        schoolId: this.currentUser.defaultSchool.id,
        assessmentTitle: this.f.quizTitle.value,
        assessmentDescription: this.f.quizDescription.value,
        subjectName: this.f.quizCategory.value,
        createdBy: this.currentUser.id,
      } as IAssessment;

      if(this.quizAssessment) {
        assessment.id = this.quizAssessment.id;
        assessment.active = true;
      }
      this.assessmentService.CreateUpdateAssessment(assessment).subscribe((res) => {
        this.presentToast('Assessment quiz update successfully.', 'success');
        this.router.navigateByUrl(`/assessment/quizzes`);
      });
    }
  }

  onChangeCategory($event) {

  }

  async AddNewCategory() {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: CourseCategoryPage,
        mode: 'ios',
        componentProps: { title: 'Course category(subject)' }
      });
    modal.onDidDismiss()
      .then((modalData: any) => {
        console.log(modalData.data);
        const categoryList = modalData.data.categoryList;
        if (categoryList.length > 0) {
          const selectedCategory = modalData.data.selectedCategory;
          this.f.quizCategory.setValue(selectedCategory.name);
          this.courseCategory = [...this.courseCategory, ...categoryList];
          // this.courseCategory = [...new Map(this.courseCategory.map(item => [item.name, item])).values()]
          this.courseCategory = this.courseCategory.map((cat, index) => {
            return { id: index.toString(), name: cat.name.toLowerCase() } as ICourseContentCategory;
          })
          this.assessmentService.SetOfflineData('Assessment', 'category', this.courseCategory);
        }
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
