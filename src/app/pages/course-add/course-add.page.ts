import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FilePreviewModel } from 'ngx-awesome-uploader';
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

  courseCategory: ICourseContentCategory[] = [];
  fileName: string;
  progress = 0;
  public courseForm: FormGroup;
  categoryWiseContent: ICategoryContentList[];

  constructor(
    public filepicker: FilePicker,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private contentService: CourseContentService,
    private authService: AuthenticationService,
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
  }

  ionViewDidEnter() {
    this.authService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      if (user.CourseContent) {
        this.contentService.GetCategoryWiseContent(user.CourseContent).subscribe((groupResponse) => {
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
    console.log("Called SubmitCourse");
    this.contentService.SubmitCourseContent(courseContent).subscribe((res) => {
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