import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ITeacher, IUser, ISchool } from '../../_models';
import { AuthenticationService } from '../../_services';
import { IonSelect, PopoverController } from '@ionic/angular';
import { ActionPopoverPage } from 'src/app/components/action-popover/action-popover.page';
import { DataShareService } from 'src/app/_services/data-share.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.page.html',
  styleUrls: ['./teachers.page.scss'],
})
export class TeachersPage implements OnInit {
  @ViewChild('schoolList') schoolSelectRef: IonSelect;

  teachers: ITeacher[] = [];
  schools: ISchool[] = [];
  currentUser: IUser;
  schoolName: string;

  constructor(
    private authenticationService: AuthenticationService,
    private popoverController: PopoverController,
    private dataShare: DataShareService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.schools = user.schools;

      const schoolId = this.activatedRoute.snapshot.paramMap.get('schoolId');
      if (schoolId) {
        this.refresh(schoolId);
      } else {
        this.refresh(this.currentUser.defaultSchool.id);
      }
    });
  }

  selectSchool() {
    this.schoolSelectRef.open();
  }

  setSchool(selectedValue) {
    this.authenticationService.ResetDefaultSchool(selectedValue.detail.value);
    this.refresh(this.currentUser.defaultSchool.id);
  }

  refresh(schoolId: string) {
    setTimeout(() => {
      this.teachers = this.currentUser.schools.find((s) => s.id === schoolId).teachers;
      this.schoolName = this.currentUser.defaultSchool.name;
    }, 10);
  }

  public async actionPopover(ev: any, teacherId: string) {

    const popover = await this.popoverController.create({
      component: ActionPopoverPage,
      mode: 'ios',
      event: ev,
      componentProps: { id: teacherId, type: 'teacher' },
      cssClass: 'pop-over-style',
    });

    popover.onDidDismiss().then((data) => {
      if (!data.data) {
        return;
      }
      const actionData = data?.data;
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
    this.router.navigateByUrl(`/teacher/edit/${this.currentUser.defaultSchool.id}/${teacherId}`);
  }

}
