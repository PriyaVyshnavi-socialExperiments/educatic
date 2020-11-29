import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { SchoolService } from '../../_services/school/school.service';
import { ISchool } from '../../_models/school';
import { IClassRoom } from '../../_models/class-room';
import { IStudent } from '../../_models/student';
import { Chart } from 'chart.js'; 
// import the plugin core
import 'chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes';

// import a particular color scheme
import { Aspect6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';



@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  getBarChart(id: string, xAxisTitle: string, yAxisTitle: string, title: string) {
    return new Chart(document.getElementById(id), {
      type: "bar",
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
              labelString: xAxisTitle,
            },
          }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: yAxisTitle,
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
          text: title
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  getLineChart(id: string, xAxisTitle: string, yAxisTitle: string, title: string) {
    return new Chart(document.getElementById(id), {
      type: "line",
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
                labelString: xAxisTitle,
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
                labelString: yAxisTitle,
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
          text: title
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  changeClasses(table: any, classes: IClassRoom[]) { 
    let tempChartData = {
      labels: null,
      datasets: []
    }
    if (classes) {
      for (let entry of classes) {
        if (table.classes.get(entry.classId).attendance.size > 0) {
          let entryData = [];
          for (let dateEntry of table.classes.get(entry.classId).attendance.keys()) {
            let total: number = table.classes.get(entry.classId).attendance.get(dateEntry).total;
            let present: number = table.classes.get(entry.classId).attendance.get(dateEntry).present;
            let attendance = Math.round((present / total) * 100);
            let data = {
              x: new Date(dateEntry),
              y: attendance
            }
            entryData.push(data);
          }
          let graphDataEntry = {
            data: entryData,
            label: entry.classRoomName,
            fill: false
          }
          tempChartData.datasets.push(graphDataEntry);
        }
      }
    }
    return tempChartData
  }

  updateBarChart(table: any, dataset: any[], id: string) {
    let chart = {
      datasets: [],
      labels: []
    }
    let data = [];
    for (let entry of dataset) {
      let total = 0;
      let present = 0;
      if (table[id].get(entry.id).attendance.size > 0) {
        for (let dateEntry of table[id].get(entry.id).attendance.keys()) {
          total += table[id].get(entry.id).attendance.get(dateEntry).total;
          present += table[id].get(entry.id).attendance.get(dateEntry).present;
        }
        let attendance = present / total * 100;
        data.push(attendance); 
        chart.labels.push(entry.name); 
      }
    }
    chart.datasets.push({
      data: data,
      fill: true
    })
    return chart; 
  }

  updateLineChart(table: any, dataset: any[], id: string) {
    let chart = {
      labels: null,
      datasets: []
    }
    if (dataset) {
      for (let entry of dataset) {
        if (table[id].get(entry.id).attendance.size > 0) {
          let entryData = [];
          for (let dateEntry of table[id].get(entry.id).attendance.keys()) {
            let total: number = table[id].get(entry.id).attendance.get(dateEntry).total;
            let present: number = table[id].get(entry.id).attendance.get(dateEntry).present;
            let attendance = Math.round((present / total) * 100);
            let data = {
              x: new Date(dateEntry),
              y: attendance
            }
            entryData.push(data);
          }
          let graphDataEntry = {
            data: entryData,
            label: entry.name,
            fill: false
          }
          chart.datasets.push(graphDataEntry);
        }
      }
    }
    return chart; 
  }

  updateGenderBarChart(data: any[]) {

  }
}
