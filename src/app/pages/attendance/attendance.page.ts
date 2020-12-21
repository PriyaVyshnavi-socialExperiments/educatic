import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AlertController, IonSelect, ToastController } from '@ionic/angular';
import { CameraSource, Camera, CameraResultType } from '@capacitor/core';
import { ContentHelper } from '../../_helpers/content-helper';
import { DomSanitizer } from '@angular/platform-browser';
import { IUser, ISchool } from '../../_models';
import { AuthenticationService } from '../../_services';
import { AttendanceService } from '../../_services/attendance/attendance.service';
import { IQueueMessage } from 'src/app/_models/queue-message';
import { dateFormat } from 'src/app/_helpers';
import { LocationService } from 'src/app/_services/location/location.service';
import { SpinnerVisibilityService } from 'ng-http-loader';

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
    public alertController: AlertController,
    public locationService: LocationService,
    private toastController: ToastController,
    private spinner: SpinnerVisibilityService,
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
    //this.classRoomId = selectedValue.detail.value;
    const classRoom = this.currentUser.defaultSchool.classRooms.find((c) => c.classId === this.classRoomId);
    this.classRoomName = `${classRoom.classRoomName} - ${classRoom.classDivision}`;
  }

  async ProcessAttendance() {
    const location = await this.locationService.GetGeolocation();
    const queueMessage = {
      schoolId: this.currentUser.defaultSchool.id,
      classId: this.classRoomId,
      studentId: '',
      teacherId: this.currentUser.id,
      pictureURLs: [this.blobDataURL],
      pictureTimestamp: new Date(),
      latitude: location.lat,
      longitude: location.lng,
    } as IQueueMessage
    this.attendanceService.QueueBlobMessage(queueMessage)
      .subscribe((res) => {
        this.AttendanceProcessConfirm();
       });
  }

  async selectImageSource() {
    if (!this.classRoomId) {
      return this.selectClass();
    }
    await this.addImage(CameraSource.Camera);
  }

  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });
    this.blobDataURL = `${this.school.name.replace(/\s/g, '')}_${this.school.id}/${this.classRoomName.replace(/\s/g, '')}_${this.classRoomId}`;
    this.blobDataURL = `${this.blobDataURL}/${dateFormat(new Date())}.${image.format}`;
    const blobData = ContentHelper.b64toBlob(image.base64String, `image/${image.format}`);
    this.uploadAttendancePhoto = ContentHelper.blobToFile(blobData, this.blobDataURL);
    this.spinner.show();
    this.attendanceService.UploadImageFile(this.uploadAttendancePhoto).subscribe(
        (res) => {
          if (res['progress'] === 100) {
            this.ProcessAttendance();
            this.presentToast(`Attendance photo upload successfully!`, `success`)
          }
        },
        (err) => {
          this.presentToast('Unable to upload attendance photo, please try again.', 'danger');
        }
      );

    const unsafeImageUrl = URL.createObjectURL(blobData);
    const imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
    this.attendancePhoto = imageUrl;
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

  async AttendanceProcessConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Attendance processing..!',
      message: `<strong>${this.classRoomName}: Attendance is in process, shortly available on dashboard.</strong>`,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'secondary',
        }
      ]
    });

    await alert.present();
  }

}
