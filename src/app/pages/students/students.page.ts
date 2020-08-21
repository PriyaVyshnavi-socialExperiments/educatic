import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonSelect, PopoverController } from '@ionic/angular';

import { IStudent, IUser, ISchool, IClassRoom } from '../../_models';
import { AuthenticationService } from '../../_services';
import { ActionPopoverPage } from '../../components/action-popover/action-popover.page';
import { DataShareService } from '../../_services/data-share.service';
import { StudentService } from '../../_services/student/student.service';
import { ClassRoomService } from 'src/app/_services/class-room/class-room.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.page.html',
  styleUrls: ['./students.page.scss'],
})
export class StudentsPage implements OnInit, AfterViewInit {
  @ViewChild('schoolList') schoolSelectRef: IonSelect;
  @ViewChild('classList') classSelectRef: IonSelect;

  students: IStudent[] = [];
  schools: ISchool[] = [];
  classRooms: any;
  schoolId: string;
  classRoomId: string;

  currentUser: IUser;

  constructor(
    private studentService: StudentService,
    private classRoomService: ClassRoomService,
    private authenticationService: AuthenticationService,
    private popoverController: PopoverController,
    private dataShare: DataShareService,
    public router: Router,

  ) { }

  ngAfterViewInit(): void {
    if (this.currentUser.schoolId) {
      this.refresh();
    } else {
      this.schoolSelectRef.open();
    }
  }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(async (user) => {
      this.currentUser = user;
      this.schoolId = user.schoolId;
      this.schools = user.schools;
      this.classRooms = user.classRooms;
    });
  }

  async refresh() {
    if (this.currentUser.classRoomId) {
    this.studentService.GetStudents(this.currentUser.schoolId, this.currentUser.classRoomId).subscribe((data) => {
      this.students = [...data]
    });
  } else {
    await this.classSelectRef.open();
  }
  }

  selectSchool() {
    this.schoolSelectRef.open();
  }

  async selectClass() {
    if (this.currentUser.schoolId) {
      await this.classSelectRef.open();
    } else {
      this.selectSchool();
    }
  }

  async setSchool(selectedValue) {
    this.currentUser.schoolId = selectedValue.detail.value;
    await this.classRoomService.GetClassRooms(this.currentUser.schoolId).toPromise().then((data) => {
      this.classRooms = data;
      setTimeout(() =>{
        this.classSelectRef.open();
      });
    });
  }

  setClassRoom(selectedValue) {
    this.classRoomId = selectedValue.detail.value;
    this.currentUser.classRoomId = this.classRoomId;
    this.refresh();
  }

  public async actionPopover(ev: any, studentId: string) {
    const popover = await this.popoverController.create({
      component: ActionPopoverPage,
      event: ev,
      componentProps: { id: studentId, type: 'student' },
      cssClass: 'pop-over-style',
    });

    popover.onDidDismiss().then((data) => {
      if(!data.data) {
        return;
      }
      const actionData = data?.data;
      this.currentUser.schoolId = actionData.currentId;
      switch (actionData?.selectedOption) {
        case 'edit':
          this.StudentEdit(actionData.currentId);
          break;
        case 'delete':
          this.StudentEdit(actionData.currentId);
          break;
        case 'upload-photo':
          this.router.navigateByUrl(`student/${actionData.currentId}/photos`);
          break;
        default:
          break;
      }
    });

    return await popover.present();
  }

  StudentEdit(studentId: string) {
    const currentStudent = this.students.find(student => student.id === studentId);
    this.dataShare.setData(currentStudent);
    this.router.navigateByUrl(`/student/${this.currentUser.schoolId}/${this.classRoomId}/edit/${studentId}`);
  }
}
