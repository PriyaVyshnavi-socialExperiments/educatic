import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../graphs/modal/modal.page';
import { DashboardService } from '../../_services/dashboard/dashboard.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    data = this.dash.getData();
    selected = {
      schools: [...this.data],
      school: this.data[0],
      classes: [...this.data[0].classList],
      class: this.data[0].classList[0], 
      maps: {
        lat: this.data[0].lat,
        long: this.data[0].long,
        points: []
      }
    };
    constructor
      (
        public modalController: ModalController, 
        public dash: DashboardService,
      ) 
      {}


    async presentModal() {
      const modal = await this.modalController.create({
        component: ModalPage,
        componentProps: {
          'labels': this.selected.class.attendence.dates,
          'title': this.selected.class.name + ' Attendence',
          'data': this.selected.class.attendence.present,
          'total': this.selected.class.attendence.total 
        }
      })
      return await modal.present();
    }

    ngOnInit() {
      this.selected.schools.forEach((school) => this.selected.maps.points.push({lat: school.lat, long: school.long}));
    }

}
