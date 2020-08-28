import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CameraSource, Camera, CameraResultType } from '@capacitor/core';
import { ImageHelper } from '../../_helpers/image-helper';
import { DomSanitizer } from '@angular/platform-browser';
import { IUser } from '../../_models';
import { AuthenticationService } from '../../_services';
import { AttendanceService } from '../../_services/attendance/attendance.service';
import { IQueueMessage } from 'src/app/_models/queue-message';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {
  attendancePhoto: any;
  currentUser: IUser;
  uploadAttendancePhoto: File;
  blobDataURLs: string[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private authenticationService: AuthenticationService,
    private attendanceService: AttendanceService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
    });
  }

  async uploadPhoto() {
    const queueMessage = {
      location: '',
      latLong: '',
      schoolId: this.currentUser.schoolId,
      classId: '',
      studentId: '',
      teacherId: this.currentUser.id,
      pictureURLs: this.blobDataURLs,
      pictureTimestamp: Date.UTC.toString(),
    } as IQueueMessage
    this.attendanceService.QueueBlobMessage(queueMessage)
      .subscribe((res) => { });
  }

  async selectImageSource() {
    await this.addImage(CameraSource.Camera);
  }

  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });

    const blobUrl = `${this.currentUser.schoolId}/attendancePhoto${new Date().getTime()}.${image.format}`;
    this.blobDataURLs.push(blobUrl);
    const blobData = ImageHelper.b64toBlob(image.base64String, `image/${image.format}`);
    this.uploadAttendancePhoto = ImageHelper.blobToFile(blobData, blobUrl);

    this.attendanceService.UploadImageFile(this.uploadAttendancePhoto)
    .subscribe((res) => { });

    const unsafeImageUrl = URL.createObjectURL(blobData);
    const imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
    this.attendancePhoto = imageUrl;
  }

  async uploadPhotoAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: '<strong>Are you sure you want to upload attendance photo?</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Okay',
          handler: () => {
            this.uploadPhoto();
          }
        }
      ]
    });

    await alert.present();
  }

}
