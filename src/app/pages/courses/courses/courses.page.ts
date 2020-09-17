import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ICourse } from 'src/app/_models/course';
import { CourseSharePage } from '../../course-share/course-share.page';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {

  courses: ICourse[] = [];
  tmp: number[] = [1,2,3,4,5];
  constructor( private modalController: ModalController,) { }

  ngOnInit() {
  }

  public async ShareCourse(evnt) {
    const modal: HTMLIonModalElement =
    await this.modalController.create({
      component: CourseSharePage,
      componentProps: {
      }
    });
  await modal.present();
  }

}
