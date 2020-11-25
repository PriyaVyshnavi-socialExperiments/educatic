import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, IonSelect, PopoverController } from '@ionic/angular';

import { IStudent, IUser, ISchool, IClassRoom } from '../../_models';
import { AuthenticationService } from '../../_services';
import { ActionPopoverPage } from '../../components/action-popover/action-popover.page';
import { StudentService } from 'src/app/_services/student/student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.page.html',
  styleUrls: ['./students.page.scss'],
})
export class StudentsPage implements OnInit {
  @ViewChild('classList') classSelectRef: IonSelect;
  students: IStudent[] = [];
  schools: ISchool[] = [];
  classRooms: IClassRoom[] = [];
  schoolId: string;
  classRoomId='';
  currentUser: IUser;
  schoolName: string;
  classRoom: IClassRoom;

  constructor(
    private authenticationService: AuthenticationService,
    private popoverController: PopoverController,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    private studentService: StudentService
  ) {
   }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.refreshStudents();
  }

  async refresh() {
    if (this.classRoomId) {
      const classRoom = this.classRooms.find(c => c.classId === this.classRoomId);
      if(!classRoom) {
        return;
      }
      this.classRoom = classRoom;
      this.students = new Array();
      classRoom.students.forEach(student => {
        student.myProfile = new Array();
        try {
          if (student.profileStoragePath) {
            const photos = JSON.parse(student.profileStoragePath)?.Photos;
            if (photos) {
              student.myProfile = [...photos];
            } else {
              student.myProfile.push(student.profileStoragePath);
            }
          }
        } catch (error) {
          student.myProfile.push(student.profileStoragePath);
        }
        this.students.push(student);
      });
    } else {
      this.classSelectRef.open();
    }
    this.schoolName = this.currentUser.defaultSchool.name;
  }

  async selectClass() {
    await this.classSelectRef.open();
  }

  setClassRoom(selectedValue) {
    //this.classRoomId = selectedValue.detail.value;
    this.router.navigateByUrl(`/students/${this.currentUser.defaultSchool.id}/${this.classRoomId}`);
  }

  public async actionPopover(ev: any, studentId: string) {
    const popover = await this.popoverController.create({
      component: ActionPopoverPage,
      event: ev,
      componentProps: { id: studentId, type: 'student' },
      cssClass: 'pop-over-style',
    });

    popover.onDidDismiss().then((data) => {
      if (!data.data) {
        return;
      }
      const actionData = data?.data;
      switch (actionData?.selectedOption) {
        case 'edit':
          this.StudentEdit(actionData.currentId);
          break;
        case 'delete':
          this.StudentDelete(actionData.currentId);
          break;
        default:
          break;
      }
    });

    return await popover.present();
  }

  StudentEdit(studentId: string) {
    this.router.navigateByUrl(`/student/${this.currentUser.defaultSchool.id}/${this.classRoomId}/edit/${studentId}`);
  }

  UploadPhoto(studentId: string) {
    this.router.navigateByUrl(`${this.currentUser.defaultSchool.id}/${this.classRoomId}/student/${studentId}/photos`);
  }

  private async StudentDelete(studentId: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm Delete',
      message: 'Are you sure you want delete this student?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Okay',
          handler: () => {
            this.studentService.DeleteStudent(this.schoolId, this.classRoomId, studentId).toPromise().finally(() => {
              setTimeout(() => {
                this.refreshStudents();
              }, 500);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  private refreshStudents() {
    this.authenticationService.currentUser?.subscribe(async (user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.schoolId = user.defaultSchool.id;
      this.schools = user.schools;
      this.classRooms = [...user.defaultSchool.classRooms];
      this.classRoomId = this.activatedRoute.snapshot.paramMap.get('classId');
      setTimeout(() => {
        this.refresh();
      });
    });
  }
}
