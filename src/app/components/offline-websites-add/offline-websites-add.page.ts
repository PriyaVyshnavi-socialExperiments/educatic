// from the course-add.page.ts
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController, Platform, ToastController } from '@ionic/angular';
import { FilePickerComponent, ValidationError } from 'ngx-awesome-uploader';
import * as blobUtil from 'blob-util';

import { ContentHelper } from 'src/app/_helpers/content-helper';
import { IUser } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

//understand what this is
//import { ICategoryContentList, ICourseContent } from '../../_models/course-content';
//import { ICourseContentCategory } from '../../../_models/course-content-category';
import { FilePicker } from '../../_services/azure-blob/file-picker.service';
import { OfflineWebsiteService } from '../../_services/offline-websites/offline-websites.service';
//import { CourseCategoryPage } from '../course-category/course-category.page'; 
import { dateFormat } from 'src/app/_helpers';
import { SpinnerVisibilityService } from 'ng-http-loader';

@Component({
  selector: 'app-offline-websites-add',
  templateUrl: './offline-website-add.page.html',
  styleUrls: ['./offline-websites-add.page.scss'],
})
export class OfflineWebsitesAddPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild('documentEditForm') documentEditForm: FormGroupDirective;
  @ViewChild('uploader') uploader: FilePickerComponent;

  //courseCategory: ICourseContentCategory[] = [];
  //courseLevel: ICourseContentCategory[] = [];
  fileName: string;
  contentHelper: any;
  progress = 0;
  public websiteForm: FormGroup;
  //categoryWiseContent: ICategoryContentList[];
  currentUser: IUser;

  constructor(
    private plt: Platform,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    public filepicker: FilePicker,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private offlineService: OfflineWebsiteService,
    private authService: AuthenticationService,
    private toastController: ToastController,
    private spinner: SpinnerVisibilityService,
  ) { }

  ngOnInit() {
    this.websiteForm = this.formBuilder.group({
      WebsiteName: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      websiteDescription: new FormControl('', [
        Validators.required,
        Validators.maxLength(1000),
      ]),
      websiteCategory: new FormControl('', [
        Validators.required,
      ])
    });
    this.contentHelper = ContentHelper;
  }
  UploadOffLineWebsiteFile(event: EventTarget) {
    const eventObj: MSInputMethodContext = event as MSInputMethodContext;
    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    const files: FileList = target.files;
    console.log(files);
    this.spinner.show();
    this.offlineService.SubmitCourseContent(files).subscribe((res) => {
      this.presentToast("Finished Uploading","green" ); 
    });
    // let blobDataURL = file.name;
    // file.arrayBuffer().then((buffer) => {
    //   const blobData = blobUtil.arrayBufferToBlob(buffer);
    //   const fileData = ContentHelper.blobToFile(blobData, blobDataURL);
    //   console.log(fileData);
    //   this.offflineWebsiteUpload.SubmitCourseContent(fileData);
    // });
  }
 // Used for browser direct file upload
 UploadWebsiteContentFile(event: EventTarget) {

    const eventObj: MSInputMethodContext = event as MSInputMethodContext;
    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    const file: FileList = target.files;

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

  /*UploadWebsiteContent( file: File = null) {
    if (this.websiteForm.invalid) {
      return;
    }
    this.spinner.show();

    // do we need this?
     /* const courseContent = {
      courseCategory: this.f.courseCategory.value,
      courseLevel: this.f.courseLevel.value,
      courseName: this.f.courseName.value,
      courseDescription: this.f.courseDescription.value,
      courseAssessment: this.f.courseAssessment.value,
      schoolId: this.currentUser.defaultSchool.id,
    } as ICourseContent; */

    /*let blobDataURL = `${courseContent.courseCategory.split(' ').join('')}`;
    const level = courseContent.courseLevel?.length ? courseContent.courseLevel.split(' ').join('') : '';
    if (level?.length) {
      blobDataURL = `${blobDataURL}/${level}`;
    }
    blobDataURL = blobDataURL + `/${courseContent.courseName}`;
*/
   // if (file) {
     // const fileExt = file.type.split('/').pop();
     // blobDataURL = `${blobDataURL}_${dateFormat(new Date())}.${fileExt}`;
     // courseContent.courseURL = blobDataURL;
      /*file.arrayBuffer().then((buffer) => {
        const blobData = blobUtil.arrayBufferToBlob(buffer);
        const fileData = ContentHelper.blobToFile(blobData, blobDataURL);
        courseContent.courseURL = blobDataURL;

        this.contentService.SubmitCourseContent(courseContent, fileData).subscribe((res) => {
          if (res['message']) {
            this.presentToast(res['message'], 'success');
            this.router.navigateByUrl(`courses`);
          } else {
            this.progress = res['progress'];
          }
        });
      });
    }

  }
  get f() {
    return this.websiteForm.controls
  }
}*/

}
