import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-modal-pop-up',
  templateUrl: './modal-pop-up.component.html',
  styleUrls: ['./modal-pop-up.component.scss'],
})
/**
 * This modal allows the user to click on graphs and enlarge them to get a better view. It uses 
 * the ModalConroller service to do this. 
 */
export class ModalPopUpComponent implements OnInit {
  @Input() chart: Chart;
  @Input() type: String;
  chartVar: Chart;

  constructor(public modalController: ModalController) { }

  /**
   * Loads the graph based in to be displayed 
   */
  loadGraph() {
    let temp = document.getElementById("chartss")
    this.chartVar = new Chart(temp, {
      type: this.type,
      data: this.chart.data,
      options: this.chart.options
    });
  }


  
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  
  ngOnInit() {
    this.loadGraph();
  }

}
