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
export class ChartsComponent implements OnChanges {
  @Input() graphType: string = "";
  @Input() data: any = {};
  @Input() id: string = "";
  @Input() charts: any = {};
  graphData = []
  labels = []
  chart: any = {};

  constructor() { }

  ngAfterViewInit() {
    // this.loadGraph();
    // this.update();
  }

  ngOnChanges() {
    //this.update();
  }

  update() {
    if (this.charts[this.id]) {
      this.charts[this.id].data.datasets = [];
      this.charts[this.id].data.datasets = this.data.datasets;
      this.charts[this.id].data.labels = this.data.labels; 
      this.charts[this.id].update();
    }
  }

  loadGraph() { 
    let temp = document.getElementById("" + this.id); 
    this.charts[this.id] = new Chart(temp, {
      type: this.graphType,
      data: {
          labels: null,
          datasets: []
      },
      options: {
        legend: {
          display: true
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
