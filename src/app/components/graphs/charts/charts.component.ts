import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Chart}  from 'chart.js';
// import the plugin core
import 'chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes';

// import a particular color scheme
import { Aspect6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  @Input() graphType: string = "";
  @Input() data: any[] = [];
  @Input() set changed(changed: any[]) {
    if (changed) {
      this.isChanged = changed;
      this.update();
    }
  };
  graphData = []
  isChanged = [];
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
        this.data.forEach((d) => {
          this.chart.data.datasets.push({
            data: d.data,
            label: d.title,
            fill: false
          })
        })
      }
      this.chart.update();
    }
  }

  loadGraph() { 
    let temp = document.getElementById("class-chart-canvas")
    this.chart = new Chart(temp, {
      type: this.graphType,
      data: {
          labels: null,
          datasets: []
      },
      options: {
        legend: {
          display: false
        },
        plugins: {
          colorschemes: {
              scheme: Aspect6
          }
        },
        scales: {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: "Days",
              },
              type: 'time',
              time: {
                unit: 'day',
                unitStepSize: 1,
                displayFormats: {
                  'day': 'MMM DD',
                }
              }
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
          text: "Attendence Data"
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }
}
