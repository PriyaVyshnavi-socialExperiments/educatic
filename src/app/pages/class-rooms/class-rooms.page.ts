import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IonSelect, PopoverController } from '@ionic/angular';
import { ClassRoomService } from 'src/app/_services/class-room/class-room.service';
import { AuthenticationService } from 'src/app/_services';
import { DataShareService } from 'src/app/_services/data-share.service';
import { Router } from '@angular/router';
import { IClassRoom, ISchool, IUser } from 'src/app/_models';
import { ActionPopoverPage } from '../../components/action-popover/action-popover.page';

@Component({
  selector: 'app-class-rooms',
  templateUrl: './class-rooms.page.html',
  styleUrls: ['./class-rooms.page.scss'],
})
export class ClassRoomsPage implements OnInit, AfterViewInit {
  @ViewChild('schoolList') schoolSelectRef: IonSelect;
  classRooms: IClassRoom[] = [];
  schools: ISchool[] = [];
  schoolId: string;
  schoolName: string;
  currentUser: IUser;

  constructor(private classRoomService: ClassRoomService,
    private authenticationService: AuthenticationService,
    private popoverController: PopoverController,
    private dataShare: DataShareService,
    public router: Router,) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      this.currentUser = user;
      this.schoolId = user.schoolId;
      this.schools = user.schools;
      if (this.schoolId) {
        this.schoolName = user.schools.find((school) => school.id === this.schoolId).name;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.currentUser.schoolId) {
      this.refresh();
    } else {
      this.schoolSelectRef.open();
    }
  }

  refresh() {
    this.classRoomService.GetClassRooms(this.currentUser.schoolId).subscribe((data) => {
      this.classRooms = [...data]
    });
  }

  public selectSchool() {
    this.schoolSelectRef.open();
  }

  setSchool(selectedValue) {
    this.currentUser.schoolId = selectedValue.detail.value;
    this.schoolName = this.currentUser.schools.find((school) => school.id === this.currentUser.schoolId).name;
    this.refresh();
  }

  public async actionPopover(ev: any, classId: string) {

    const popover = await this.popoverController.create({
      component: ActionPopoverPage,
      mode: 'ios',
      event: ev,
      componentProps: { id: classId, schoolId: this.currentUser.schoolId, type: 'class-room' },
      cssClass: 'pop-over-style',
    });

    popover.onDidDismiss().then((data) => {
      if(!data.data) {
        return;
      }
      const actionData = data?.data;
      switch (actionData?.selectedOption) {
        case 'edit':
          this.ClassRoomEdit(actionData.currentId);
          break;
        case 'delete':
          this.ClassRoomEdit(actionData.currentId);
          break;
        default:
          break;
      }
    });

    return await popover.present();
  }

  public ClassRoomEdit(classId: string) {
    const currentClassRoom = this.classRooms.find(classRoom => classRoom.classId === classId);
    this.dataShare.setData(currentClassRoom);
    this.router.navigateByUrl(`/class-room/edit/${this.currentUser.schoolId}/${classId}`);
  }

  public  StudentList(ev: any, classId: string) {
    this.currentUser.classRoomId = classId;
    this.router.navigateByUrl(`/students/${this.currentUser.schoolId}/${classId}`);
  }

  public  NewStudent(ev: any, classId: string) {
    this.currentUser.classRoomId = classId;
    this.router.navigateByUrl(`/student/add/${this.currentUser.schoolId}/${classId}`);
  }

  public edit() {

  }
  /**
   * name
   */
  public delete() {

  }

}
