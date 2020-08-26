import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActionSheetController, Platform } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource, Capacitor, FilesystemDirectory } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StudentService } from '../../_services/student/student.service';
import { IStudentPhoto } from '../../_models/student-photos';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../_services';
import { IUser } from '../../_models';
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
  studentBlobData: File[] =[];

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private studentService: StudentService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
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
    //this.studentBlobData.forEach(photo => {
      this.studentService.UploadImageFile(this.studentBlobData)
      .subscribe((res) => {});
    //});
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

    const blobData = this.b64toBlob(image.base64String, `image/${image.format}`);
    const imageFile = this.blobToFile(blobData, `${this.currentUser.schoolId}/${this.studentId}/${id}_photo.${image.format}`);
    // this.studentService.UploadImageFile(
    //   this.blobToFile(blobData, `${this.currentUser.schoolId}/${this.studentId}/${id}_photo.${image.format}`)
    // ).subscribe((res) => {
    // });

    //  const file: File = target.files[0];

    const studentPhoto = {
      id: this.studentId,
      schoolId: this.currentUser.schoolId,
      classId: this.currentUser.classRoomId,
      blobData: imageFile,
      format: `image/${image.format}`,
      imageName: `${this.studentId}_${id}`,
      sequenceId: id
    } as IStudentPhoto

    this.studentBlobData = [...this.studentBlobData, imageFile]

    await this.studentService.UploadStudentPhoto(studentPhoto).then(() => {
      const unsafeImageUrl = URL.createObjectURL(blobData);
      const imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
      this.studentPhotos[id].image = imageUrl;// this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    });
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    const b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return theBlob as File;
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

  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

}
