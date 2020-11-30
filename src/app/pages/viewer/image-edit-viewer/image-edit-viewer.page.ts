import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { ToastUiImageEditorComponent } from 'ngx-tui-image-editor';
import * as blobUtil from 'blob-util';

import { ContentHelper } from 'src/app/_helpers/content-helper';
import { ICourseContent } from 'src/app/_models/course-content';
import { CourseContentService } from 'src/app/_services/course-content/course-content.service';
import { IStudentAssignment } from 'src/app/_models/assignment';
import { AssignmentService } from 'src/app/_services/assignment/assignment.service';
import { SpinnerVisibilityService } from 'ng-http-loader';

@Component({
  selector: 'app-image-edit-viewer',
  templateUrl: './image-edit-viewer.page.html',
  styleUrls: ['./image-edit-viewer.page.scss'],
})
export class ImageEditViewerPage implements OnInit {
  @ViewChild(ToastUiImageEditorComponent) editorComponent: ToastUiImageEditorComponent;

  contentURL = '';
  contentType = '';
  teacherAssignment: ICourseContent;
  studentAssignment: IStudentAssignment;
  progress = 0;
  title = '';

  options = {};

  constructor(private contentService: CourseContentService,
    private navCtrl: NavController,
    private assignmentService: AssignmentService,
    private spinner: SpinnerVisibilityService,
    private toastController: ToastController,) {
  }
  ngOnInit() {
    this.teacherAssignment = history.state.assignment;
    this.studentAssignment = history.state.studAssignment;
    if (!this.teacherAssignment.courseCategory) {
      this.navCtrl.back();
    }
    this.title = `${this.teacherAssignment.courseCategory} - ${this.teacherAssignment.courseName}`;
    if (!this.teacherAssignment.isTokenRequired) {
      this.contentService.GetAzureContentURL(this.teacherAssignment.courseURL).subscribe((url) => {
        this.contentURL = url;
      })
    } else {
      this.contentURL = this.teacherAssignment.courseURL;
    }

    {
      this.options = {
        includeUI: {
          loadImage: {
            path: this.contentURL + `?d=${Math.floor(Math.random() * 1000000000)}`,
            name: this.teacherAssignment.courseName,
          },
          menu: ['text', 'draw'],
          initMenu: 'draw',
          menuBarPosition: 'bottom',
        },
      }
    };
  }

  SaveAssignment() {
    this.spinner.show();
    const base64String = this.editorComponent.editorInstance.toDataURL();
    const blobData = blobUtil.dataURLToBlob(base64String);
    const file = ContentHelper.blobToFile(blobData, this.studentAssignment.assignmentURL);
    this.assignmentService.AssignmentStudent(this.studentAssignment, file).subscribe(
      (res) => {
        console.log("res: ", res);
        if (res['message']) {
          this.presentToast(res['message'], 'success');
        } else {
          this.progress = res['progress'];
        }
      },
      err => {
        this.presentToast('Unable to upload assignment, please try again ', 'danger');
        //this.NavigateToAssignmentList();
      },
      () => { }
    );
  }

  private async presentToast(msg, type) {
    this.spinner.hide();
    this.progress = 0;
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 3000,
      color: type,
      buttons: [{
        text: 'Close',
        role: 'cancel',
      }
      ]
    });
    toast.present();
  }

}
