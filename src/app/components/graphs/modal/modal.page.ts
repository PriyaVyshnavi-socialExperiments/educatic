import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() chart: Chart;
  @Input() type: String;
  chartVar: Chart;

  constructor(public modalController: ModalController) { }

  loadGraph() {
    let temp = document.getElementById("chartss")
    console.log(this.chart);
    this.chartVar = new Chart(temp, {
      type: this.type,
      data: this.chart.data,
      options: this.chart.options
    });
  }


  
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  
  ngOnInit() {
    this.loadGraph();
  }
}
