import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActionSheetController, Platform } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource, Capacitor, FilesystemDirectory } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StudentService } from '../../_services/student/student.service';
import { IStudentPhoto } from '../../_models/student-photos';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../_services';
import { IUser } from '../../_models';
import { ImageHelper } from 'src/app/_helpers/image-helper';
import { IQueueMessage } from 'src/app/_models/queue-message';
const { Camera, Filesystem } = Plugins;

@Component({
  selector: 'app-student-photo-upload',
  templateUrl: './student-photo-upload.page.html',
  styleUrls: ['./student-photo-upload.page.scss'],
})
export class StudentPhotoUploadPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  studentPhotos = [];
  currentUser: IUser;
  studentId: string;
  studentBlobData: File[] = [];
  studentBlobDataURLs: string[] = [];

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private studentService: StudentService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public alertController: AlertController

  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.studentId = params.get('studentId');
    });
    for (let i = 0; i < 5; i++) {
      this.studentPhotos.push({ id: i, image: '' });
    }
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.DisplayStudentPhotos();
    });
  }

  async selectImageSource(id) {
    await this.addImage(CameraSource.Camera, id);
  }

  async uploadPhotos() {
    const queueMessage = {
      location: '',
      latLong: '',
      schoolId: this.currentUser.schoolId,
      classId: '',
      studentId: this.studentId,
      teacherId: this.currentUser.id,
      pictureURLs: this.studentBlobDataURLs,
      pictureTimestamp: Date.UTC.toString(),
    } as IQueueMessage

    this.studentService.QueueBlobMessage(queueMessage).subscribe((res) => { });
  }

  DisplayStudentPhotos() {
    this.studentService.GetStudentPhotos(this.studentId).subscribe((studentPhotos) => {
      if (studentPhotos && studentPhotos.length > 0) {
        studentPhotos.forEach(studentPhoto => {
          const unsafeImageUrl = URL.createObjectURL(JSON.parse(studentPhoto.blobData));
          const imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
          this.studentPhotos[studentPhoto.sequenceId].image = imageUrl;
        });
      }

    });
  }

  async addImage(source: CameraSource, id) {
    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });

    const blobData = ImageHelper.b64toBlob(image.base64String, `image/${image.format}`);
    const blobURL = `${this.currentUser.schoolId}/${this.studentId}/${id}_photo.${image.format}`;
    const imageFile = ImageHelper.blobToFile(blobData, blobURL);
    this.studentService.UploadImageFile(imageFile).subscribe((res) => {
      console.log("res: ", res)
    }
    )
    this.studentBlobDataURLs = [...this.studentBlobDataURLs, blobURL]
    const studentPhoto = {
      id: this.studentId,
      schoolId: this.currentUser.schoolId,
      classId: this.currentUser.classRoomId,
      blobData: imageFile,
      format: `image/${image.format}`,
      imageName: `${this.studentId}_${id}`,
      sequenceId: id
    } as IStudentPhoto

    //this.studentBlobData = [...this.studentBlobData, imageFile]

    await this.studentService.UploadStudentPhoto(studentPhoto).then(() => {
      const unsafeImageUrl = URL.createObjectURL(blobData);
      const imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
      this.studentPhotos[id].image = imageUrl;// this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    });
  }

  // Used for browser direct file upload
  uploadFile(event: EventTarget) {
    const eventObj: MSInputMethodContext = event as MSInputMethodContext;
    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    const file: File = target.files[0];
    // this.studentService.UploadImageFile(file).subscribe((newImage) => {
    //   this.studentPhotos.push(newImage);
    // });
  }

  deleteImage(image, index) {
    this.studentService.DeleteImage(image._id).subscribe(res => {
      this.studentPhotos.splice(index, 1);
    });
  }

  async uploadPhotoAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: '<strong>Are you sure you want to upload photo?</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Okay',
          handler: () => {
            this.uploadPhotos();
          }
        }
      ]
    });

    await alert.present();
  }

}
