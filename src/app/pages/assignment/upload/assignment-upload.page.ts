import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActionSheetController, Platform, ToastController } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource, CameraPhoto } from '@capacitor/core';
import * as blobUtil from 'blob-util';
import { ImageHelper } from 'src/app/_helpers/image-helper';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from 'src/app/_services/assignment/assignment.service';
import { IAssignment } from 'src/app/_models/assignment';
import { dateFormat } from 'src/app/_helpers';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';
import { ISchool, IUser } from 'src/app/_models';

const { Camera } = Plugins;

@Component({
  selector: 'app-assignment-upload',
  templateUrl: './assignment-upload.page.html',
  styleUrls: ['./assignment-upload.page.scss'],
})
export class AssignmentUploadPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  public assignmentForm: FormGroup;
  @ViewChild('documentEditForm') documentEditForm: FormGroupDirective;
  public subjectName: string;
  public type: string;
  public classId: string;
  currentUser: IUser;
  school: ISchool;

  constructor(private formBuilder: FormBuilder,
    private plt: Platform,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private assignmentService: AssignmentService,
    private authenticationService: AuthenticationService,
    private toastController: ToastController,
    private actionSheetCtrl: ActionSheetController) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.school = user.defaultSchool;
    });

    this.assignmentForm = this.formBuilder.group({
      assignmentName: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      assignmentDescription: new FormControl('', [
        Validators.required,
        Validators.maxLength(1000),
      ])
    });
    this.subjectName = this.activatedRoute.snapshot.paramMap.get('subjectName');
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    this.classId = this.activatedRoute.snapshot.paramMap.get('classId');
    console.log('Upload Assignments..');
  }

  NavigateToAssignmentList() {
    this.router.navigateByUrl(`${this.type}/assignment/${this.classId}/list/${this.subjectName}?d=${new Date()}`);
  }

  SelectAssignment() {
    this.selectAssignmentSource();
  }

  async selectAssignmentSource() {
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
    const cameraImage = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source
    });
    this.UploadAssignment(cameraImage, null);
  }

  // Used for browser direct file upload
  uploadFile(event: EventTarget) {
    const eventObj: MSInputMethodContext = event as MSInputMethodContext;
    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    const file: File = target.files[0];
    if ((/\.(gif|jpe?g|tiff?|png|webp|bmp|pdf)$/i).test(file.name)) {
      this.UploadAssignment(null, file);
    } else {
      this.presentToast(`This file type is not supported.`, 'danger');
    }
  }

  get f() {
    return this.assignmentForm.controls
  }

  private UploadAssignment(cameraImage: CameraPhoto = null, file: File = null) {
    if (this.assignmentForm.invalid) {
      return;
    }

    const classRoom = this.currentUser.defaultSchool.classRooms.find((c) => c.classId === this.classId);

    const assignmentDetails = {
      classId: this.classId,
      schoolId: this.school.id,
      subjectName: this.subjectName,
      assignmentName: this.f.assignmentName.value,
      assignmentDescription: this.f.assignmentDescription.value
    } as IAssignment;

    let blobDataURL = `${this.school.name.replace(/\s/g, '')}_${this.school.id}/${classRoom.classRoomName.replace(/\s/g, '')}_${classRoom.classId}/${this.subjectName}`;

    if (cameraImage) {
      const blobData = ImageHelper.b64toBlob(cameraImage.base64String, `image/${cameraImage.format}`);
      blobDataURL = `${blobDataURL}/${assignmentDetails.assignmentName.replace(/\s/g, '')}_${dateFormat(new Date())}.${cameraImage.format}`;
      file = ImageHelper.blobToFile(blobData, blobDataURL);
      assignmentDetails.assignmentURL = blobDataURL;
      this.assignmentService.AssignmentTeacher(assignmentDetails, file).subscribe((res) => {
        if (res['message']) {
          this.presentToast(res['message'], 'success');
          this.NavigateToAssignmentList();
        }
      });
    } else {
      const fileExt = file.type.split('/').pop();
      blobDataURL = `${blobDataURL}/${assignmentDetails.assignmentName.replace(/\s/g, '')}_${dateFormat(new Date())}.${fileExt}`;
      file.arrayBuffer().then((buffer) => {
        const blobData = blobUtil.arrayBufferToBlob(buffer);
        const fileData = ImageHelper.blobToFile(blobData, blobDataURL);
        assignmentDetails.assignmentURL = blobDataURL;
        this.assignmentService.AssignmentTeacher(assignmentDetails, fileData).subscribe((res) => {
          if (res['message']) {
            this.presentToast(res['message'], 'success');
            this.NavigateToAssignmentList();
          }
        });
      })
    }
  }

  private async presentToast(msg, type) {
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