import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IClassRoom, IUser, Role } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-assignment-classes',
  templateUrl: './assignment-classes.page.html',
  styleUrls: ['./assignment-classes.page.scss'],
})
export class AssignmentClassesPage implements OnInit {
  classRooms: IClassRoom[] = [];
  schoolId: string;
  schoolName: string;
  currentUser: IUser;

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService,
  ) { }

  ionViewWillEnter() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      if (this.currentUser.role === Role.Student) {
        const classRoomId = this.currentUser.defaultSchool.classRooms[0].classId;
        this.selectClassRoom(classRoomId);
      }
      this.refresh();
    });
  }
  ngOnInit() {

  }

  public selectClassRoom(classId: string) {
    this.router.navigateByUrl(`teacher/assignment/${classId}/subjects`);
  }

  private refresh() {
    setTimeout(() => {
      const school = this.currentUser.schools.find((s) => s.id === this.currentUser.defaultSchool.id);
      this.classRooms = [...school.classRooms];
      this.schoolName = school.name;
    }, 10);
  }

}
