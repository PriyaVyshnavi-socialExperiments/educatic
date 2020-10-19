import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-assignment-view',
  templateUrl: './assignment-view.page.html',
  styleUrls: ['./assignment-view.page.scss'],
})
export class AssignmentViewPage implements OnInit {

  constructor(private modalController: ModalController,) { }

  ngOnInit() {
  }

  dismissModal() {
    this.modalController.dismiss().then(() => { this.modalController = null; });
  }

}
