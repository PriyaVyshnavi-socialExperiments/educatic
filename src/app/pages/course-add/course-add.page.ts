import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FilePreviewModel } from 'ngx-awesome-uploader';
import { ICourseContent } from '../../_models/course-content';
import { ICourseContentCategory } from '../../_models/course-content-category';
import { FilePicker } from '../../_services/azure-blob/file-picker.service';
import { CourseContentService } from '../../_services/course-content/course-content.service';
import { CourseCategoryPage } from '../course-category/course-category.page';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.page.html',
  styleUrls: ['./course-add.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CourseAddPage implements OnInit {

  @ViewChild('documentEditForm') documentEditForm: FormGroupDirective;

  courseCategory: ICourseContentCategory[] = [];
  fileName: string;
  progress = 0;
  public courseForm: FormGroup;

  constructor(
    public filepicker: FilePicker,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private courseContent: CourseContentService,
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
      categoryName: new FormControl('', [
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
        this.courseCategory = [...data.data];
      });
    await modal.present();
  }

  SubmitCourse() {
    if (this.courseForm.invalid) {
      return;
    }

    const courseContent = {
      categoryName: this.f.categoryName.value,
      courseName: this.f.courseName.value,
      courseDescription: this.f.courseDescription.value,
      courseURL: this.filepicker.blobFileName + '/' + this.fileName,
    } as ICourseContent;

    this.courseContent.SubmitCourseContent(courseContent).subscribe((res)=> {
      console.log("SubmitCourse SuccessFully");
    });
   
  }

  onChangeCategory(category) {
    this.filepicker.blobFileName = category.value;
  }

  uploadSuccess(uploadedFile) {
    console.log("uploadSuccess: ", uploadedFile);
    this.fileName = uploadedFile.fileName;
    this.documentEditForm.ngSubmit.emit();
  }

  uploadFail(item) {
    console.log("uploadFail: ", item);
  }

}