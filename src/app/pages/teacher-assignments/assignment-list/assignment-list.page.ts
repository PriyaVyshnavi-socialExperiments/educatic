import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { AssignmentViewPage } from '../assignment-view/assignment-view.page';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.page.html',
  styleUrls: ['./assignment-list.page.scss'],
})
export class AssignmentListPage implements OnInit {

  constructor(private modalController: ModalController,) { }

  ngOnInit() {
  }
  ViewAssignment() {

  }

  async openStudentAssignmentInModal() {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: ViewerModalComponent,
      componentProps: {
        src: '../../../../assets/images/sample-img.png',
        title: `Mathematics assignment`
      },
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true,
    });

    return await modal.present();
  }
}
