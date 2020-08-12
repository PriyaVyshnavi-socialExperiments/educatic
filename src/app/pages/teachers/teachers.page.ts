import { Component, OnInit } from '@angular/core';
import { ITeacher, IUser } from '../../_models';
import { TeacherService } from '../../_services/teacher/teacher.service';
import { AuthenticationService } from '../../_services';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.page.html',
  styleUrls: ['./teachers.page.scss'],
})
export class TeachersPage implements OnInit {
  teachers: ITeacher[] = [];
  currentUser: IUser;

  constructor(
    private teacherService: TeacherService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
    this.teacherService.GetTeachers(this.currentUser.defaultSchoolId).subscribe((data) => {
      this.teachers = [...data]
    });
  }

}
