import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { IClassRoom, ISchool } from 'src/app/_models';
import { ICourseContentDistribution } from 'src/app/_models/course-content-distribution';
import { AuthenticationService } from 'src/app/_services';
import { CourseContentService } from 'src/app/_services/course-content/course-content.service';

@Component({
  selector: 'app-assessment-share',
  templateUrl: './assessment-share.page.html',
  styleUrls: ['./assessment-share.page.scss'],
})
export class AssessmentSharePage implements OnInit {

  courseShareForm: FormGroup;
  schoolInfo: ISchool[] = [];
  classInfo: IClassRoom[] = [];
  @Input() contentId: string;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private authenticationService: AuthenticationService,
    private contentService: CourseContentService,
    private toastController: ToastController,
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
    this.courseShareForm.reset();
  }

  ionViewDidEnter() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.schoolInfo = user.schools;
    });
  }

  get f() {
    return this.courseShareForm.controls
  }

  dismissModal() {
    this.modalController.dismiss().then(() => { this.modalController = null; });
  }

  SubmitCourseShare() {
    if (this.courseShareForm.invalid) {
      return;
    }
    const courseContent = {
      schoolId: this.f.schoolId.value,
      classId: this.f.classId.value,
      contentId: this.contentId,
    } as ICourseContentDistribution;

    this.contentService.DistributeCourseContent(courseContent).subscribe(() => {
      this.courseShareForm.reset();
      this.presentToast();
      this.dismissModal();
    });
  }

  onChangeSchool(schoolId) {
    this.classInfo = this.schoolInfo.find((c) => c.id === schoolId.value).classRooms;
  }

  private async presentToast() {
    const toast = await this.toastController.create({
      message: 'Course content Distributed successfully.',
      position: 'bottom',
      duration: 5000,
      color: 'success',
      buttons: [{
        text: 'Close',
        role: 'cancel',
      }
      ]
    });
    toast.present();
  }
}
