// from the course-add.page.ts
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

//understand what this is
//import { ICategoryContentList, ICourseContent } from '../../_models/course-content';
//import { ICourseContentCategory } from '../../../_models/course-content-category';
import { FilePicker } from '../../_services/azure-blob/file-picker.service';
//import { CourseContentService } from '../../_services/course-content/course-content.service';
//import { CourseCategoryPage } from '../course-category/course-category.page'; 
import { dateFormat } from 'src/app/_helpers';
import { SpinnerVisibilityService } from 'ng-http-loader';

const { Camera } = Plugins;

@Component({
  selector: 'app-offline-websites-add',
  templateUrl: './offline-websites-add.page.html',
  styleUrls: ['./offline-websites.page.scss'],
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
    //private contentService: CourseContentService,
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

}
// export interface IWebsiteContent {
//   id: string;
//   schoolId: string;
//   websiteName: string;
//   websiteDescription: string;
//   websiteURL: string;
//   thumbnailURL: string;
//   uploadedBy: string;
//   active: boolean;
//   isBlobUrl: boolean; //? not sure
// }



