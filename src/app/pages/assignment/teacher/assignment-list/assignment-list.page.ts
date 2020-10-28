import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { IAssignment, IStudentAssignment } from 'src/app/_models/assignment';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { Platform, ActionSheetController } from '@ionic/angular';
import { ImageHelper } from 'src/app/_helpers/image-helper';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from 'src/app/_services/assignment/assignment.service';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';
import { ISchool, IUser } from 'src/app/_models';
import { environment } from 'src/environments/environment';
import { ICourseContent } from 'src/app/_models/course-content';
const { Camera } = Plugins;

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.page.html',
  styleUrls: ['./assignment-list.page.scss'],
})
export class AssignmentListPage implements OnInit {
  assignments: IAssignment[] = [];

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  assignmentFor = 'teacher';
  classId: string;
  subjectName: string;
  currentUser: IUser;
  school: ISchool;

  constructor(
    private modalController: ModalController,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private plt: Platform,
    private assignmentService: AssignmentService,
    private authenticationService: AuthenticationService,
    private actionSheetCtrl: ActionSheetController) {
  }

  ionViewWillEnter() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.school = user.defaultSchool;
      this.classId = this.activatedRoute.snapshot.paramMap.get('classId');
      this.subjectName = this.activatedRoute.snapshot.paramMap.get('subjectName');
      this.assignmentService.GetAssignments(this.school.id, this.classId).subscribe((list) => {
        this.assignmentService.GetSubjectWiseAssignments(list).subscribe((asms) => {
          const subjectWiseAssignments = asms.find((a) => a.key === this.subjectName).assignment;
          this.assignments = [...subjectWiseAssignments]
          this.assignments.map(p =>
            p.studentAssignments !== ''
              ? { ...p, studentAssignmentList: JSON.parse(p.studentAssignments) }
              : p
          );
        });
      })
    });
    console.log('assignment list..')
  }

  ngOnInit() {

  }



  ViewAssignment() {

  }

  segmentChanged(event) {
    this.assignmentFor = event.detail.value;
  }

  async openStudentAssignmentInModal(assignment: IAssignment) {
    const fileExt = assignment.assignmentURL.split('.').pop();
    const imageUrl = `${environment.blobURL}/assignments/${assignment.assignmentURL}`;

    if (fileExt.toLowerCase() === 'pdf') {
      const content = {
        courseURL: imageUrl,
        categoryName: this.subjectName,
        courseName: assignment.assignmentName,
        isTokenRequired: true,
      } as ICourseContent;

      this.router.navigateByUrl(`content/${content.id}/pdf-viewer`, { state: content });

    } else {
      const modal: HTMLIonModalElement = await this.modalController.create({
        component: ViewerModalComponent,
        componentProps: {
          src: imageUrl,
          title: `${this.subjectName} - ${assignment.assignmentName}`
        },
        cssClass: 'ion-img-viewer',
        keyboardClose: true,
        showBackdrop: true,
      });

      return await modal.present();
    }

  }

  UploadAssignment() {
    this.router.navigateByUrl(`assignment/teacher/${this.classId}/upload/${this.subjectName}`);
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
