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
    if (this.schoolId) {
      this.refresh();
    } else {
      this.schoolSelectRef.open();
    }
  }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      this.currentUser = user;
      this.schoolId = user.defaultSchoolId;
      this.schools = user.schools;
    });
  }

  refresh() {
    this.studentService.GetStudents(this.currentUser.defaultSchoolId, this.currentUser.classRoomId).subscribe((data) => {
      this.students = [...data]
    });
  }

  selectSchool() {
    this.schoolSelectRef.open();
  }

  async selectClass() {
    if (this.currentUser?.defaultSchoolId) {
      await this.classSelectRef.open();
    } else {
      this.selectSchool();
    }
  }

  async setSchool(selectedValue) {
    this.currentUser.defaultSchoolId = selectedValue.detail.value;
    await this.classRoomService.GetClassRooms(this.currentUser.defaultSchoolId).toPromise().then((data) => {
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
      const actionData = data?.data;
      this.currentUser.defaultSchoolId = actionData.currentId;
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
    this.router.navigateByUrl(`/student/${this.currentUser.defaultSchoolId}/${this.classRoomId}/edit/${studentId}`);
  }
}
