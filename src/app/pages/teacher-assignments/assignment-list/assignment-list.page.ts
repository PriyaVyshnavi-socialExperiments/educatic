import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { IAssignment } from 'src/app/_models/assignment';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { Platform, ActionSheetController } from '@ionic/angular';
import { ImageHelper } from 'src/app/_helpers/image-helper';
const { Camera } = Plugins;

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.page.html',
  styleUrls: ['./assignment-list.page.scss'],
})
export class AssignmentListPage implements OnInit {
  assignments: IAssignment[] = [];
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  badgeToggle = false;
  assignmentFor = 'teacher';
  constructor(
    private modalController: ModalController,
    private plt: Platform,
    private actionSheetCtrl: ActionSheetController) { }

  ngOnInit() {
  }
  ViewAssignment() {

  }

  segmentChanged(event) {
    this.assignmentFor = event.detail.value;
  }

  async openStudentAssignmentInModal() {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: ViewerModalComponent,
      componentProps: {
        src: '../../../../assets/images/sample-img.png',
        title: `Mathematics assignment`
      },
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true,
    });

    return await modal.present();
  }

  UploadAssignment() {
    this.selectImageSource();
  }

  async selectImageSource() {
    const buttons = [
      {
        text: 'Take Photo',
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera);
        }
      },
      {
        text: 'Choose From Photos Photo',
        icon: 'image',
        handler: () => {
          this.addImage(CameraSource.Photos);
        }
      }
    ];

    // Only allow file selection inside a browser
    if (!this.plt.is('hybrid')) {
      buttons.push({
        text: 'Choose a File',
        icon: 'attach',
        handler: () => {
          this.fileInput.nativeElement.click();
        }
      });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Assignment Source',
      buttons
    });
    await actionSheet.present();
  }

  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source
    });

    const blobData = ImageHelper.b64toBlob(image.base64String, `image/${image.format}`);
    const imageName = 'Give me a name';

  }

  // Used for browser direct file upload
  uploadFile(event: EventTarget) {
    const eventObj: MSInputMethodContext = event as MSInputMethodContext;
    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    const file: File = target.files[0];
  }
}
