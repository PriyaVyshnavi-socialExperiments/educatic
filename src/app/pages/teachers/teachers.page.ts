import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ITeacher, IUser, ISchool } from '../../_models';
import { AuthenticationService } from '../../_services';
import { AlertController, IonSelect, PopoverController } from '@ionic/angular';
import { ActionPopoverPage } from 'src/app/components/action-popover/action-popover.page';
import { DataShareService } from 'src/app/_services/data-share.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TeacherService } from 'src/app/_services/teacher/teacher.service';

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
  schoolId: string;

  constructor(
    private authenticationService: AuthenticationService,
    private popoverController: PopoverController,
    private dataShare: DataShareService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    private teacherService: TeacherService,

  ) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.refreshTeachers();
  }

  selectSchool() {
    this.schoolSelectRef.open();
  }

  setSchool(selectedValue) {
    this.authenticationService.ResetDefaultSchool(selectedValue.detail.value);
    this.router.navigateByUrl(`/teachers/${selectedValue.detail.value}`);
    //this.refresh(this.currentUser.defaultSchool.id);
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
          this.TeacherDelete(actionData.currentId);
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

  public async TeacherDelete(teacherId: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm Delete',
      message: 'Are you sure you want delete this teacher?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Okay',
          handler: () => {
            this.teacherService.DeleteTeacher(this.schoolId, teacherId).toPromise().finally(() => {
              setTimeout(() => {
                this.refreshTeachers();
              }, 500);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  refreshTeachers() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.schools = user.schools;

       this.schoolId = this.activatedRoute.snapshot.paramMap.get('schoolId');
      if (this.schoolId) {
        this.refresh(this.schoolId);
      } else {
        this.schoolId = this.currentUser.defaultSchool.id;
        this.refresh(this.currentUser.defaultSchool.id);
      }
    });
  }

}
