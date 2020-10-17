import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() labels: string[] = [];
  @Input() data: string[] = [];
  @Input() title: string = "";
  @Input() total: number = 0;
  chart: Chart;

  constructor(public modalController: ModalController) { }

  loadGraph() {
    let temp = document.getElementById("chartss")
    this.chart = new Chart(temp, {
      type: 'line',
      data: {
          labels: this.labels,
          datasets: [{
              data: this.data,
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true,
                      max: this.total,
                      callback: (value) => {  
                        return value; // convert it to percentage
                      },
                  }
              }]
          },
          title: {
            display: true,
            text: this.title
          },
          responsive: true,
          maintainAspectRatio: false,
      }
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
