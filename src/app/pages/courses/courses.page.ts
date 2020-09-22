import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ICourseContent } from 'src/app/_models/course-content';
import { CourseSharePage } from '../course-share/course-share.page';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {

  courses: ICourseContent[] = [];
  tmp: number[] = [1,2,3,4,5];
  constructor( private modalController: ModalController,) { }

  ngOnInit() {
  }

  public async ShareCourse(event) {
    const modal: HTMLIonModalElement =
    await this.modalController.create({
      component: CourseSharePage,
      componentProps: {
      }
    });
  await modal.present();
  }

}
