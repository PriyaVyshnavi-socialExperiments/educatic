import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ITeacher, IUser, ISchool } from '../../_models';
import { TeacherService } from '../../_services/teacher/teacher.service';
import { AuthenticationService } from '../../_services';
import { IonSelect, PopoverController } from '@ionic/angular';
import { ActionPopoverPage } from 'src/app/components/action-popover/action-popover.page';
import { DataShareService } from 'src/app/_services/data-share.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.page.html',
  styleUrls: ['./teachers.page.scss'],
})
export class TeachersPage implements OnInit, AfterViewInit {
  @ViewChild('schoolList') schoolSelectRef: IonSelect;

  teachers: ITeacher[] = [];
  schools: ISchool[] = [];
  schoolId: string;
  currentUser: IUser;

  constructor(
    private teacherService: TeacherService,
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
    this.authenticationService.currentUser.subscribe((user) => {
      this.currentUser = user;
      this.schoolId = user.schoolId;
      this.schools = user.schools;
    });
  }

  selectSchool() {
    this.schoolSelectRef.open();
  }

  setSchool(selectedValue) {
    this.currentUser.schoolId = selectedValue.detail.value;
    this.refresh();
  }

  refresh() {
    this.teacherService.GetTeachers(this.currentUser.schoolId).subscribe((data) => {
      this.teachers = [...data]
    });
  }

  public async actionPopover(ev: any, schoolId: string) {

    const popover = await this.popoverController.create({
      component: ActionPopoverPage,
      mode: 'ios',
      event: ev,
      componentProps: { id: schoolId, type: 'teacher' },
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
          this.TeacherEdit(actionData.currentId);
          break;
        case 'delete':
          this.TeacherEdit(actionData.currentId);
          break;
        default:
          break;
      }
    });

    return await popover.present();
  }

  public TeacherEdit(teacherId: string) {
    const currentTeacher = this.teachers.find(teacher => teacher.id === teacherId);
    this.dataShare.setData(currentTeacher);
    this.router.navigateByUrl(`/teacher/edit/${this.currentUser.schoolId}/${teacherId}`);
  }

}
