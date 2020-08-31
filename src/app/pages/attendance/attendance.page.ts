import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AlertController, IonSelect } from '@ionic/angular';
import { CameraSource, Camera, CameraResultType } from '@capacitor/core';
import { ImageHelper } from '../../_helpers/image-helper';
import { DomSanitizer } from '@angular/platform-browser';
import { IUser, ISchool } from '../../_models';
import { AuthenticationService } from '../../_services';
import { AttendanceService } from '../../_services/attendance/attendance.service';
import { IQueueMessage } from 'src/app/_models/queue-message';
import { dateFormat } from 'src/app/_helpers';
import { GeolocationHelper } from 'src/app/_helpers/geolocation';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit, AfterViewInit {
  @ViewChild('classList') classSelectRef: IonSelect;

  attendancePhoto: any;
  currentUser: IUser;
  uploadAttendancePhoto: File;
  blobDataURL: string;
  classRooms: any;
  classRoomId: string;
  classRoomName: string;
  school: ISchool;

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
      this.school = user.defaultSchool;
      this.classRooms = user.defaultSchool.classRooms;
    });
  }

  ngAfterViewInit(): void {
    if (!this.classRoomId) {
      this.selectClass();
    }
  }

  async selectClass() {
    await this.classSelectRef.open();
  }

  setClassRoom(selectedValue) {
    this.classRoomId = selectedValue.detail.value;
    const classRoom = this.currentUser.defaultSchool.classRooms.find((c) => c.classId === this.classRoomId);
    this.classRoomName = `${classRoom.classRoomName} - ${classRoom.classDivision}`;
  }

  async uploadPhoto() {
    const position = await GeolocationHelper.GetGeolocation();
    const queueMessage = {
      schoolId: this.currentUser.defaultSchool.id,
      classId: this.classRoomId,
      studentId: '',
      teacherId: this.currentUser.id,
      pictureURLs: [this.blobDataURL],
      pictureTimestamp: new Date(),
      latitude: position.coords.latitude.toString(),
      longitude: position.coords.longitude.toString(),
    } as IQueueMessage
    this.attendanceService.QueueBlobMessage(queueMessage)
      .subscribe((res) => { });
  }

  async selectImageSource() {
    if (!this.classRoomId) {
      return this.selectClass();
    }
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
    this.blobDataURL = `${this.school.name.replace(/\s/g, '')}_${this.school.id}/${this.classRoomId}`;
    this.blobDataURL = `${this.blobDataURL}/${dateFormat(new Date())}.${image.format}`;
    const blobData = ImageHelper.b64toBlob(image.base64String, `image/${image.format}`);
    this.uploadAttendancePhoto = ImageHelper.blobToFile(blobData, this.blobDataURL);

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
      message: `<strong>Are you sure you want to process attendance? <br/> ${this.classRoomName}</strong>`,
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
