import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-course-share',
  templateUrl: './course-share.page.html',
  styleUrls: ['./course-share.page.scss'],
})
export class CourseSharePage implements OnInit {
  courseShareForm: FormGroup;
  schoolInfo: any[] = [];

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
}
