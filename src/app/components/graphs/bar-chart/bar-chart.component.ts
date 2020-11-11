import { Component, OnInit, Input } from '@angular/core';
import { Chart}  from 'chart.js';
// import the plugin core
import 'chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes';

// import a particular color scheme
import { Aspect6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit {
  @Input() graphType: string = "";
  @Input() data: any = {};
  @Input() Title: String;
  @Input() xAxisTitle: String;
  @Input() set changed(changed: any[]) {
    if (changed) {
      console.log("Changed");
      this.isChanged = changed;
      this.update();
    }
  };
  graphData = []
  isChanged: any[] = [];
  labels = []
  chart : Chart;

  constructor() { }
  ngOnInit() {
    this.loadGraph();
    this.update();
  }


  update() {
    if (this.chart) {
      this.chart.data.datasets = []
      if (this.isChanged) {
        this.chart.data.datasets.push({
          data: this.data.data,
          fill: true
        })
      }
      this.chart.data.labels = this.data.labels;
      this.chart.update();
    }
  }

  loadGraph() { 
    let temp = document.getElementById("school-chart-canvas")
    this.chart = new Chart(temp, {
      type: this.graphType,
      data: {
          labels: null,
          datasets: []
      },
      options: {
        plugins: {
          colorschemes: {
              scheme: Aspect6
          }
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.xAxisTitle,
            },
          }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: "Percent Attendance",
              },
              ticks: {                  
                  beginAtZero: true,
                  max: 100,
                  callback: (value) => {  
                    return value + "%"; // convert it to percentage
                  },
              }
            }]
        },
        title: {
          display: true,
          text: this.Title
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }
}
