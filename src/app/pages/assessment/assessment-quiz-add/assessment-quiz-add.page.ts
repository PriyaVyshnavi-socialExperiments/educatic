import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { ICourseContentCategory } from 'src/app/_models/course-content-category';
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

  constructor(private formBuilder: FormBuilder,
    private modalController: ModalController,
    private alertController: AlertController,) { }

  ngOnInit() {
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
  }

  get f() {
    return this.quizForm.controls
  }

  SubmitQuiz(){

  }

  onChangeCategory($event){

  }

  confirmQuizDelete() {

  }


 async AddNewCategory(){
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
        this.courseCategory = [...new Map(this.courseCategory.map(item => [item.name, item])).values()]
      }
    });
  await modal.present();
  }

}
