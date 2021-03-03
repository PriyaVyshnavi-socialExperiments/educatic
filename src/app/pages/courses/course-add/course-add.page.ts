import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController, Platform, ToastController } from '@ionic/angular';
import { FilePickerComponent, ValidationError } from 'ngx-awesome-uploader';
import { Plugins, CameraResultType, CameraSource, CameraPhoto } from '@capacitor/core';
import * as blobUtil from 'blob-util';

import { ContentHelper } from 'src/app/_helpers/content-helper';
import { IUser } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';
import { ICategoryContentList, ICourseContent } from '../../../_models/course-content';
import { ICourseContentCategory } from '../../../_models/course-content-category';
import { FilePicker } from '../../../_services/azure-blob/file-picker.service';
import { CourseContentService } from '../../../_services/course-content/course-content.service';
import { CourseCategoryPage } from '../course-category/course-category.page';
import { dateFormat, removeSpecialSymbolSpace } from 'src/app/_helpers';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Guid } from 'guid-typescript';

const { Camera } = Plugins;

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.page.html',
  styleUrls: ['./course-add.page.scss'],
})
export class CourseAddPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild('documentEditForm') documentEditForm: FormGroupDirective;
  @ViewChild('uploader') uploader: FilePickerComponent;

  courseCategory: ICourseContentCategory[] = [];
  courseLevel: ICourseContentCategory[] = [];
  fileName: string;
  contentHelper: any;
  progress = 0;
  public courseForm: FormGroup;
  categoryWiseContent: ICategoryContentList[];
  currentUser: IUser;

  constructor(
    private plt: Platform,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    public filepicker: FilePicker,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private contentService: CourseContentService,
    private authService: AuthenticationService,
    private toastController: ToastController,
    private spinner: SpinnerVisibilityService,
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
      courseCategory: new FormControl('', [
        Validators.required,
      ]),
      courseLevel: new FormControl('', []),
      courseAssessment: new FormControl('', []),
    });
    this.contentHelper = ContentHelper;
  }

  ionViewDidEnter() {
    this.authService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      if (user.courseContent) {
        this.contentService.GetCategoryWiseContent(user.courseContent).subscribe((groupResponse) => {
          this.categoryWiseContent = Object.values(groupResponse);
          console.log("this.categoryWiseContent: ", this.categoryWiseContent);
          this.courseCategory = this.categoryWiseContent.map((cat, index) => {
            return { id: index.toString(), name: cat.key } as ICourseContentCategory;
          });

          let index = 0;
          let courseLevels = [];
          this.categoryWiseContent.forEach((content) => {
            const levels = content.content.map((item) => {
              return { id: (++index).toString(), name: item.courseLevel } as ICourseContentCategory;
            });
            courseLevels = [...courseLevels, ...levels];
          });
          courseLevels = [...new Map(courseLevels.map(item => [item.name, item])).values()];

          this.courseLevel = courseLevels.filter(function (el) {
            return el.name !== null && el.name !== '';
          });
        });
      }
    });
  }

  async SelectCourseContentSource() {
    const buttons = [
      {
        text: 'Take Photo',
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera);
        }
      },
      // {
      //   text: 'Choose From Photos Photo',
      //   icon: 'image',
      //   handler: () => {
      //     this.addImage(CameraSource.Photos);
      //   }
      // },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          //this.NavigateToAssignmentList();
        }
      }
    ];

    // Only allow file selection inside a browser
    //if (!this.plt.is('hybrid')) {
    buttons.push({
      text: 'Choose a File',
      icon: 'attach',
      handler: () => {
        this.fileInput.nativeElement.click();
      }
    });
    //}

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Course Source',
      backdropDismiss: false,
      buttons
    });
    await actionSheet.present();

  }

  async addImage(source: CameraSource) {
    const cameraImage = await Camera.getPhoto({
      quality: 40,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });
    this.UploadCourseContent(cameraImage, null);
  }

  // Used for browser direct file upload
  UploadCourseContentFile(event: EventTarget) {
    const eventObj: MSInputMethodContext = event as MSInputMethodContext;
    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    const file: File = target.files[0];
    const fileExt = file.type.split('/').pop();
    if ((ContentHelper.ContentUploadSupported.indexOf(fileExt.toLowerCase()) > -1)) {
      this.UploadCourseContent(null, file);
    } else {
      this.presentToast(`This file type is not supported.`, 'danger');
    }
  }

  UploadCourseContent(cameraImage: CameraPhoto = null, file: File = null) {
    if (this.courseForm.invalid) {
      return;
    }
    this.spinner.show();
    const courseContent = {
      courseCategory: removeSpecialSymbolSpace(this.f.courseCategory.value),
      categoryName: this.f.courseCategory.value,
      courseLevel: this.f.courseLevel.value,
      courseName: this.f.courseName.value,
      courseDescription: this.f.courseDescription.value,
      courseAssessment: this.f.courseAssessment.value,
      schoolId: this.currentUser.defaultSchool.id,
    } as ICourseContent;

    if (!courseContent.id) {
      courseContent.id = Guid.create().toString();
    }

    let blobDataURL = `${courseContent.courseCategory.split(' ').join('')}`;
    const level = courseContent.courseLevel?.length ? courseContent.courseLevel.split(' ').join('') : '';
    if (level?.length) {
      blobDataURL = `${blobDataURL}/${level}`;
    }
    blobDataURL = blobDataURL + `/${courseContent.courseName}`;

    if (cameraImage) {
      const blobData = ContentHelper.b64toBlob(cameraImage.base64String, `image/${cameraImage.format}`);
      blobDataURL = `${blobDataURL}_${dateFormat(new Date())}.${cameraImage.format}`;
      file = ContentHelper.blobToFile(blobData, blobDataURL);
      courseContent.courseURL = blobDataURL;
      this.contentService.SubmitCourseContent(courseContent, file).subscribe(
        (res) => {
          const response = res[1];
          if (response['message']) {
            this.presentToast(response['message'], 'success');
            this.router.navigateByUrl(`courses`);
          } else {
            this.progress = res['progress'];
          }
        },
        (err) => {
          courseContent.isOffline = true;
          this.updateOffline(courseContent, blobData);
        },
        () => {
          this.updateOffline(courseContent);
        });
    } else {
      const fileExt = file.type.split('/').pop();
      blobDataURL = `${blobDataURL}_${dateFormat(new Date())}.${fileExt}`;
      courseContent.courseURL = blobDataURL;
      file.arrayBuffer().then((buffer) => {
        const blobData = blobUtil.arrayBufferToBlob(buffer);
        const fileData = ContentHelper.blobToFile(blobData, blobDataURL);
        courseContent.courseURL = blobDataURL;
        this.contentService.SubmitCourseContent(courseContent, fileData).subscribe((res) => {
          const response = res[1];
          if (response['message']) {
            this.presentToast(response['message'], 'success');
            this.router.navigateByUrl(`courses`);
          } else {
            this.progress = res['progress'];
          }
        },
          (err) => {
            courseContent.isOffline = true;
            this.updateOffline(courseContent, blobData);
          },
          () => {
            this.updateOffline(courseContent);
          });
      });
    }

  }

  ionViewWillLeave() {
    this.courseForm.reset();
  }

  get f() {
    return this.courseForm.controls
  }

  updateOffline(courseContent: ICourseContent, blobData?: any) {
    if (courseContent.isOffline && blobData) {
      blobUtil.blobToBase64String(blobData).then((streamData) => {
        this.contentService.UpdateCourseContentOfflineList(courseContent, courseContent.id, streamData);
      })
    } else {
      this.contentService.UpdateCourseContentOfflineList(courseContent);
    }
  }

  public async AddNewCategory() {
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
          this.filepicker.blobFileName = selectedCategory.name;
          this.f.courseCategory.setValue(selectedCategory.name);
          this.courseCategory = [...this.courseCategory, ...categoryList];
          this.courseCategory = [...new Map(this.courseCategory.map(item => [item.name, item])).values()];
        }
      });
    await modal.present();
  }

  public async AddNewLevel() {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: CourseCategoryPage,
        mode: 'ios',
        componentProps: { title: 'Subject Level' }
      });
    modal.onDidDismiss()
      .then((modalData: any) => {
        console.log(modalData.data);
        const courseLevelList = modalData.data.categoryList;
        if (courseLevelList.length > 0) {
          const selectedCategory = modalData.data.selectedCategory;
          this.filepicker.blobFileName = selectedCategory.name;
          this.f.courseLevel.setValue(selectedCategory.name);
          this.courseLevel = [...this.courseLevel, ...courseLevelList];
          this.courseLevel = [...new Map(this.courseLevel.map(item => [item.name, item])).values()]
        }
      });
    await modal.present();
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
    this.spinner.hide();
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