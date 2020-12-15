import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActionSheetController, Platform, ToastController } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource, CameraPhoto } from '@capacitor/core';
import { SpinnerVisibilityService } from 'ng-http-loader';
import * as blobUtil from 'blob-util';
import { ContentHelper } from 'src/app/_helpers/content-helper';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from 'src/app/_services/assignment/assignment.service';
import { IAssignment, IStudentAssignment } from 'src/app/_models/assignment';
import { dateFormat } from 'src/app/_helpers';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';
import { ISchool, IUser, Role } from 'src/app/_models';
import { DataShareService } from 'src/app/_services/data-share.service';

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
  isStudent: boolean;
  progress = 0;

  constructor(private formBuilder: FormBuilder,
    private plt: Platform,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private assignmentService: AssignmentService,
    private authenticationService: AuthenticationService,
    private toastController: ToastController,
    private dataShare: DataShareService,
    private spinner: SpinnerVisibilityService,
    private actionSheetCtrl: ActionSheetController) {
  }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.school = user.defaultSchool;
      this.isStudent = this.currentUser.role === Role.Student;
    });
    if (!this.isStudent) {
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
    } else {
      this.selectAssignmentSource();
    }
    this.subjectName = this.activatedRoute.snapshot.paramMap.get('subjectName');
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    this.classId = this.activatedRoute.snapshot.paramMap.get('classId');
    console.log('Upload Assignments..');
  }

  NavigateToAssignmentList() {
    this.router.navigateByUrl(`assignment/${this.classId}/list/${this.subjectName}?d=${new Date()}`);
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
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          this.NavigateToAssignmentList();
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
      backdropDismiss: false,
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
    const fileExt = file.type.split('/').pop();
    if ((ContentHelper.ImgSupported.indexOf(fileExt.toLowerCase()) > -1)) {
      this.UploadAssignment(null, file);
    } else {
      this.presentToast(`This file type is not supported.`, 'danger');
    }
  }

  get f() {
    return this.assignmentForm.controls
  }

  private UploadAssignment(cameraImage: CameraPhoto = null, file: File = null) {
    if (!this.isStudent && this.assignmentForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.isStudent) {
      this.StudentUploadAssignment(cameraImage, file);
    } else {
      this.TeacherUploadAssignment(cameraImage, file);
    }
  }

  private TeacherUploadAssignment(cameraImage: CameraPhoto = null, file: File = null) {
    const classRoom = this.currentUser.defaultSchool.classRooms.find((c) => c.classId === this.classId);

    const assignmentDetails = {
      classId: this.classId,
      schoolId: this.school.id,
      subjectName: this.subjectName,
      assignmentName: this.f.assignmentName.value,
      assignmentDescription: this.f.assignmentDescription.value,
      createdBy: this.currentUser.id
    } as IAssignment;

    let blobDataURL = `${this.school.name.replace(/\s/g, '')}_${this.school.id}/${classRoom.classRoomName.replace(/\s/g, '')}_${classRoom.classId}/${this.subjectName}`;

    if (cameraImage) {
      const blobData = ContentHelper.b64toBlob(cameraImage.base64String, `image/${cameraImage.format}`);
      blobDataURL = `${blobDataURL}/${assignmentDetails.assignmentName.replace(/\s/g, '')}_${dateFormat(new Date())}.${cameraImage.format}`;
      file = ContentHelper.blobToFile(blobData, blobDataURL);
      assignmentDetails.assignmentURL = blobDataURL;
      this.assignmentService.AssignmentTeacher(assignmentDetails, file).subscribe(
        (res) => {
          if (res['message']) {
            this.presentToast(res['message'], 'success');
            this.NavigateToAssignmentList();
          } else {
            this.progress = res['progress'];
          }
        },
        err => {
          this.presentToast('Unable to upload assignment, please try again ', 'danger');
          this.NavigateToAssignmentList();
        },
        () => { }
      );
    } else {
      const fileExt = file.type.split('/').pop();
      blobDataURL = `${blobDataURL}/${assignmentDetails.assignmentName.replace(/\s/g, '')}_${dateFormat(new Date())}.${fileExt}`;
      file.arrayBuffer().then((buffer) => {
        const blobData = blobUtil.arrayBufferToBlob(buffer);
        const fileData = ContentHelper.blobToFile(blobData, blobDataURL);
        assignmentDetails.assignmentURL = blobDataURL;
        this.assignmentService.AssignmentTeacher(assignmentDetails, fileData).subscribe(
          (res) => {
            if (res['message']) {
              this.presentToast(res['message'], 'success');
              this.NavigateToAssignmentList();
            } else {
              this.progress = res['progress'] === 100 ? 0 : res['progress'];
            }
          },
          err => {
            this.presentToast('Unable to upload assignment, please try again ', 'danger');
            this.NavigateToAssignmentList();
          },
          () => { }
        );
      })
    }
  }

  private StudentUploadAssignment(cameraImage: CameraPhoto = null, file: File = null) {

    this.dataShare.getData().subscribe((assignment: IAssignment) => {
      const classRoom = this.currentUser.defaultSchool.classRooms[0];

      const assignmentDetails = {
        schoolId: this.currentUser.defaultSchool.id,
        assignmentId: assignment.id,
        studentId: this.currentUser.id,
        studentName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
      } as IStudentAssignment;

      let blobDataURL = `${this.school.name.replace(/\s/g, '')}_${this.school.id}/${classRoom.classRoomName.replace(/\s/g, '')}_${classRoom.classId}/${this.subjectName}/${assignmentDetails.studentName}`;

      if (cameraImage) {
        const blobData = ContentHelper.b64toBlob(cameraImage.base64String, `image/${cameraImage.format}`);
        blobDataURL = `${blobDataURL}/${assignment.assignmentName.replace(/\s/g, '')}_${dateFormat(new Date())}.${cameraImage.format}`;
        file = ContentHelper.blobToFile(blobData, blobDataURL);
        assignmentDetails.assignmentURL = blobDataURL;
        this.assignmentService.AssignmentStudent(assignmentDetails, file).subscribe(
          (res) => {
            if (res['message']) {
              this.presentToast(res['message'], 'success');
              this.NavigateToAssignmentList();
            } else {
              this.progress = res['progress'];
            }
          },
          err => {
            this.presentToast('Unable to upload assignment, please try again ', 'danger');
            this.NavigateToAssignmentList();
          },
          () => { }
        );
      } else {
        const fileExt = file.type.split('/').pop();
        blobDataURL = `${blobDataURL}/${assignment.assignmentName.replace(/\s/g, '')}_${dateFormat(new Date())}.${fileExt}`;
        file.arrayBuffer().then((buffer) => {
          const blobData = blobUtil.arrayBufferToBlob(buffer);
          const fileData = ContentHelper.blobToFile(blobData, blobDataURL);
          assignmentDetails.assignmentURL = blobDataURL;
          this.assignmentService.AssignmentStudent(assignmentDetails, fileData).subscribe(
            (res) => {
              if (res['message']) {
                this.presentToast(res['message'], 'success');
                this.NavigateToAssignmentList();
              } else {
                this.progress = res['progress'];
              }
            },
            err => {
              this.presentToast('Unable to upload assignment, please try again ', 'danger');
              this.NavigateToAssignmentList();
            },
            () => { });
        })
      }
    });

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
