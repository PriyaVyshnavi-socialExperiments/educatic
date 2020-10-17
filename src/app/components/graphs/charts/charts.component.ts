import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Chart}  from 'chart.js';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  @Input() labels: string[] = [];
  @Input() title: string = "";
  @Input() data: number[] = [];
  @Input() set total(total: number) {
    this.max = total;
    if (this.chart) {
      this.update();
    }
  };
  max = 0;
  chart : Chart;

  constructor() { }
  ngOnInit() {
    this.loadGraph();
  }


  update() {
    this.chart.data.datasets[0].data = this.data;
    this.chart.data.datasets[0].label = this.title;
    this.chart.data.labels = this.labels;
    this.chart.options.title.text = this.title;
    this.chart.options.scales.yAxes[0].ticks.max = this.max;
    this.chart.update();
  }

  loadGraph() { 
    let temp = document.getElementById("canvas")
    this.chart = new Chart(temp, {
      type: 'line',
      data: {
          labels: this.labels,
          datasets: [{
              data: this.data,
              label: this.title
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true,
                      max: this.max,
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
}
