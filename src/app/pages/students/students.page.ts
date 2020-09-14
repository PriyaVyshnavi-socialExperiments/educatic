import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonSelect, PopoverController } from '@ionic/angular';

import { IStudent, IUser, ISchool, IClassRoom } from '../../_models';
import { AuthenticationService } from '../../_services';
import { ActionPopoverPage } from '../../components/action-popover/action-popover.page';
import { DataShareService } from '../../_services/data-share.service';
import { LazyLoadImageHooks } from '../../_helpers/lazy-load-image-hook';

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
  classRoomId: string;
  currentUser: IUser;
  schoolName: string;
  classRoom: IClassRoom;

  constructor(
    private authenticationService: AuthenticationService,
    private popoverController: PopoverController,
    private dataShare: DataShareService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private lazyloadImage: LazyLoadImageHooks,
  ) { }

  loadImage$(img) {
    return Promise.resolve(this.lazyloadImage.loadImage(img).subscribe((res) => res));
  };

  ngOnInit() {
    // this.authenticationService.currentUser?.subscribe(async (user) => {
    //   if (!user) {
    //     return;
    //   }
    //   this.currentUser = user;
    //   this.schoolId = user.defaultSchool.id;
    //   this.schools = user.schools;
    //   this.classRooms = [...user.defaultSchool.classRooms];
    // });
  }

  ionViewDidEnter() {
    this.authenticationService.currentUser?.subscribe(async (user) => {
      if (!user) {
        return;
      }
      console.table(user.defaultSchool.classRooms);
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

  async refresh() {
    if (this.classRoomId) {
      const classRoom = this.classRooms.find(c => c.classId === this.classRoomId);
      this.classRoom = classRoom;
      this.students = new Array();
      classRoom.students.forEach(student => {
        student.myProfile = new Array();
        try {
          if (student.profileStoragePath) {
            const photos = JSON.parse(student.profileStoragePath)?.Photos;
            if (photos) {
              student.myProfile = [...photos];
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
    this.classRoomId = selectedValue.detail.value;
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
      if (!data.data) {
        return;
      }
      const actionData = data?.data;
      switch (actionData?.selectedOption) {
        case 'edit':
          this.StudentEdit(actionData.currentId);
          break;
        case 'delete':
          this.StudentEdit(actionData.currentId);
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
    const currentStudent = this.students.find(student => student.id === studentId);
    this.dataShare.setData(currentStudent);
    this.router.navigateByUrl(`${this.currentUser.defaultSchool.id}/${this.classRoomId}/student/${studentId}/photos`);
  }
}
