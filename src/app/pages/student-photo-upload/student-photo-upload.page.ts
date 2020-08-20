import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActionSheetController, Platform } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource, Capacitor } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StudentService } from '../../_services/student/student.service';
const { Camera } = Plugins;

@Component({
  selector: 'app-student-photo-upload',
  templateUrl: './student-photo-upload.page.html',
  styleUrls: ['./student-photo-upload.page.scss'],
})
export class StudentPhotoUploadPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  studentPhotos = [];

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private studentService: StudentService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    for (let i = 0; i < 5; i++) {
      this.studentPhotos.push({ id: i, image: '' });
    }
  }

  async selectImageSource(id) {
    await this.addImage(CameraSource.Camera, id);
  }

  async uploadPhotos() {
    
  }

  async addImage(source: CameraSource, id) {
    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });

    // const blobData = this.b64toBlob(image.base64String, `image/${image.format}`);
    // const imageName = 'Give me a name';
    
    this.studentPhotos[id].image = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl)); 
    // this.studentService.UploadImage(blobData, imageName, image.format).subscribe((newImage) => {
    //   this.studentPhotos[id].image = newImage
    // });
  }

  // Used for browser direct file upload
  uploadFile(event: EventTarget) {
    const eventObj: MSInputMethodContext = event as MSInputMethodContext;
    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    const file: File = target.files[0];
    this.studentService.UploadImageFile(file).subscribe((newImage) => {
      this.studentPhotos.push(newImage);
    });
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
