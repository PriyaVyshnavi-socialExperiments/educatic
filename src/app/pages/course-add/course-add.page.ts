import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ICourseCategory } from 'src/app/_models/course-category';
import { FilePicker } from 'src/app/_services/azure-blob/file-picker.service';
import { CourseCategoryPage } from '../course-category/course-category.page';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.page.html',
  styleUrls: ['./course-add.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CourseAddPage implements OnInit {
  courseCategory: ICourseCategory[] = [];
  progress = 0;
  public courseForm: FormGroup;

  constructor(
    public filepicker: FilePicker,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    ) { }

  ngOnInit() {
    this.courseForm = this.formBuilder.group({
      courseName: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      courseDescription: new FormControl('', [
        Validators.required,
        Validators.maxLength(1000),
      ]),
      categoryId: new FormControl('', [
        Validators.required,
      ])
    });
  }

  get f() {
    return this.courseForm.controls
  }

  public async AddNewCategory() {
    const modal: HTMLIonModalElement =
    await this.modalController.create({
      component: CourseCategoryPage,
      componentProps: {
      }
    });
    modal.onDidDismiss()
      .then((data: any) => {
        console.log(data);
        this.courseCategory =[...data.data];
    });
  await modal.present();
  }

  SubmitCourse() {

  }

  setPercentBar(i) {
    setTimeout(() => {
      const apc = (i / 100)
      this.progress = apc;
    }, 100 * i);
  }

  uploadSuccess(item) {
    console.log("uploadSuccess: ", item);
  }

  uploadFail(item) {
    console.log("uploadFail: ", item);
  }

}