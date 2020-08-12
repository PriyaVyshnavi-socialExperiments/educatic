import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ITeacher, IUser, ISchool } from '../../_models';
import { TeacherService } from '../../_services/teacher/teacher.service';
import { AuthenticationService } from '../../_services';
import { IonSelect } from '@ionic/angular';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.page.html',
  styleUrls: ['./teachers.page.scss'],
})
export class TeachersPage implements OnInit, AfterViewInit {
  teachers: ITeacher[] = [];
  schools: ISchool[] = [];
  schoolId: string;

  currentUser: IUser;
  @ViewChild('schoolList') schoolSelectRef: IonSelect;

  constructor(
    private teacherService: TeacherService,
    private authenticationService: AuthenticationService,
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

  selectSchool() {
    this.schoolSelectRef.open();
  }

  setSchool(selectedValue) {
    this.currentUser.defaultSchoolId = selectedValue.detail.value;
    this.refresh();
  }

  refresh() {
    this.teacherService.GetTeachers(this.currentUser.defaultSchoolId).subscribe((data) => {
      this.teachers = [...data]
    });
  }

}
