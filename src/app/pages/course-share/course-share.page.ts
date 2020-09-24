import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IClassRoom, ISchool } from '../../_models';
import { AuthenticationService } from '../../_services/authentication/authentication.service';

@Component({
  selector: 'app-course-share',
  templateUrl: './course-share.page.html',
  styleUrls: ['./course-share.page.scss'],
})
export class CourseSharePage implements OnInit {
  courseShareForm: FormGroup;
  schoolInfo: ISchool[] = [];
  classInfo: IClassRoom[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private authenticationService: AuthenticationService,
    ) { }

  ngOnInit() {
    this.courseShareForm = this.formBuilder.group({
      schoolId: new FormControl('', [
        Validators.required
      ]),
      classId: new FormControl('', [
        Validators.required
      ]),
    });
  }

  ionViewDidEnter() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.schoolInfo = user.schools;
    });
  }

  dismissModal() {
    this.modalController.dismiss().then(() => { this.modalController = null; });
  }

  SubmitCourseShare() {

  }

  onChangeSchool(schoolId) {
    this.classInfo = this.schoolInfo.find((c) => c.id === schoolId.value).classRooms;
  }

}
