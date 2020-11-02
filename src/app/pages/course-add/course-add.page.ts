import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { FilePickerComponent, ValidationError } from 'ngx-awesome-uploader';
import { ContentHelper } from 'src/app/_helpers/image-helper';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';
import { ICategoryContentList, ICourseContent } from '../../_models/course-content';
import { ICourseContentCategory } from '../../_models/course-content-category';
import { FilePicker } from '../../_services/azure-blob/file-picker.service';
import { CourseContentService } from '../../_services/course-content/course-content.service';
import { CourseCategoryPage } from '../course-category/course-category.page';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.page.html',
  styleUrls: ['./course-add.page.scss'],
})
export class CourseAddPage implements OnInit {

  @ViewChild('documentEditForm') documentEditForm: FormGroupDirective;
  @ViewChild('uploader') uploader: FilePickerComponent;

  courseCategory: ICourseContentCategory[] = [];
  fileName: string;
  contentHelper: any;
  progress = 0;
  public courseForm: FormGroup;
  categoryWiseContent: ICategoryContentList[];

  constructor(
    public filepicker: FilePicker,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private contentService: CourseContentService,
    private authService: AuthenticationService,
    private toastController: ToastController,

  ) { }

  ngOnInit() {
    console.log(history.state);
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
    this.contentHelper = ContentHelper;
  }

  ionViewDidEnter() {
    this.authService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      if (user.courseContent) {
        this.contentService.GetCategoryWiseContent(user.courseContent).subscribe((groupResponse) => {
          this.categoryWiseContent = Object.values(groupResponse);
          this.courseCategory = this.categoryWiseContent.map((cat, index) => {
            return { id: index.toString(), name: cat.key } as ICourseContentCategory;
          })
        });
      }
    });
  }

  ionViewWillLeave() {
    this.courseForm.reset();
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
      .then((modalData: any) => {
        console.log(modalData.data);
        const categoryList = modalData.data.categoryList;
        if (categoryList.length > 0) {
          const selectedCategory = modalData.data.selectedCategory;
          this.filepicker.blobFileName = selectedCategory.name;
          this.courseForm.setValue({
            categoryName: selectedCategory.name,
            courseName: '',
            courseDescription: ''
          });
          this.courseCategory = [...this.courseCategory, ...categoryList];
          this.courseCategory = [...new Map(this.courseCategory.map(item => [item.name, item])).values()]
        }
      });
    await modal.present();
  }

  SubmitCourse() {
    if (this.courseForm.invalid && !this.fileName) {
      return;
    }

    const courseContent = {
      categoryName: this.f.categoryName.value,
      courseName: this.f.courseName.value,
      courseDescription: this.f.courseDescription.value,
      courseURL: this.filepicker.blobFileName + '/' + this.fileName,
    } as ICourseContent;
    this.contentService.SubmitCourseContent(courseContent).subscribe((res) => {
    });

  }

  onChangeCategory(category) {
    this.filepicker.blobFileName = category.value;
  }

  uploadSuccess(uploadedFile) {
    this.fileName = uploadedFile.fileName;
    this.documentEditForm.ngSubmit.emit();
  }

  uploadFail(item) {
  }

  onValidationError(error: ValidationError) {
    switch (error.error) {
      case 'EXTENSIONS':
        this.presentToast(`Unable to upload a file: This file type is not supported.`, 'danger');
        break;

      default:
        break;
    }

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