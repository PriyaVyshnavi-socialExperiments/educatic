import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer } from '@angular/platform-browser';
import { StudentService } from '../../_services/student/student.service';
import { IStudentPhoto } from '../../_models/student-photos';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../_services';
import { IUser, ISchool, IStudent } from '../../_models';
import { ContentHelper } from 'src/app/_helpers/content-helper';
import { IQueueMessage } from 'src/app/_models/queue-message';
import { LocationService } from 'src/app/_services/location/location.service';
import { SpinnerVisibilityService } from 'ng-http-loader';

const { Camera } = Plugins;

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
  classId: string;
  studentBlobData: File[] = [];
  studentBlobDataURLs: string[] = [];
  student: IStudent;
  school: ISchool;

  constructor(
    private studentService: StudentService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public alertController: AlertController,
    public locationService: LocationService,
    private toastController: ToastController,
    private spinner: SpinnerVisibilityService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.studentId = this.activatedRoute.snapshot.paramMap.get('studentId');
    this.classId = this.activatedRoute.snapshot.paramMap.get('classId');

    this.authenticationService.currentUser?.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.school = user.defaultSchool;
      const classRoom = this.school.classRooms.find(c => c.classId === this.classId);
      this.student = classRoom.students.find(student => student.id === this.studentId);
      for (let i = 0; i < 5; i++) {
        const img = this.student.myProfile ? this.student.myProfile[i] : '';
        this.studentPhotos.push({ id: i, image: `${img ? img : 'default'}` });
      }
    });
  }

  async selectImageSource(id) {
    await this.addImage(CameraSource.Camera, id);
  }

  async uploadPhotos() {
    const location = await this.locationService.GetGeolocation();
    const queueMessage = {
      schoolId: this.currentUser.defaultSchool.id,
      classId: this.classId,
      studentId: this.studentId,
      teacherId: this.currentUser.id,
      pictureURLs: this.studentBlobDataURLs,
      pictureTimestamp: new Date(),
      latitude: location.lat,
      longitude: location.lng,
    } as IQueueMessage

    this.studentService.QueueBlobMessage(queueMessage).subscribe((res) => {
      this.student.myProfile = [...queueMessage.pictureURLs];
      this.student.profileStoragePath = JSON.stringify({Photos:[...queueMessage.pictureURLs]});
      this.studentService.UpdateStudentOffline(this.student);
    });
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

    const blobData = ContentHelper.b64toBlob(image.base64String, `image/${image.format}`);
    const schoolName = this.school.name.replace(/\s/g, '');
    const studentName = `${this.student.firstName + this.student.lastName}_${this.studentId}`;
    const blobURL = `${schoolName}_${this.school.id}/${this.classId}/${studentName.replace(/\s/g, '')}/${id}_photo.${image.format}`;

    const imageFile = ContentHelper.blobToFile(blobData, blobURL);
    this.spinner.show();
    this.studentService.UploadImageFile(imageFile).subscribe(
      (res) => {
        if (res['progress'] === 100) {
          this.uploadPhotos();
          this.presentToast(`Student photo upload successfully!`, `success`)
        }
      },
      (err) => {
        this.presentToast('Unable to upload student photo, please try again.', 'danger');
      }
    )
    this.studentBlobDataURLs = [...this.studentBlobDataURLs, blobURL]
    const studentPhoto = {
      id: this.studentId,
      schoolId: this.currentUser.defaultSchool.id,
      classId: this.classId,
      blobData: imageFile,
      format: `image/${image.format}`,
      imageName: `${this.studentId}_${id}`,
      sequenceId: id
    } as IStudentPhoto

    await this.studentService.UploadStudentPhoto(studentPhoto).then(() => {
      this.studentPhotos[id].image = blobData;
    });
  }

  // Used for browser direct file upload
  uploadFile(event: EventTarget) {
    const eventObj: MSInputMethodContext = event as MSInputMethodContext;
    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    const file: File = target.files[0];
  }

  deleteImage(image, index) {
    this.studentService.DeleteImage(image._id).subscribe(res => {
      this.studentPhotos.splice(index, 1);
    });
  }

  GoToStudents() {
    this.router.navigateByUrl(`students/${this.currentUser.defaultSchool.id}/${this.student.classId}`);
    // this.router.navigateByUrl(`students/${this.currentUser.defaultSchool.id}`);
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

  async uploadPhotoAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: '<strong>Are you sure you want upload photo(s) to process?</strong>!!!',
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
