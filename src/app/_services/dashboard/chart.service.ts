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

interface IAttendance {
  present: number,
  total: number,
  male: {
    present: number,
    total: number
  },
  female: {
    present: number,
    total: number
  },
  nonBinary: {
    present: number,
    total: number
  }
}

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

  updateBarChart(attendance: {name: string, attendance: [string, IAttendance][]}[]) {
    let chart = {
      datasets: [],
      labels: []
    }
    let data = [];
    for (let entity of attendance) {
      let total = 0;
      let present = 0;
      if (entity.attendance.length > 0) {
        for (let entry of entity.attendance) {
          total += entry[1].total;
          present += entry[1].present;
        }
        let attendance = present / total * 100;
        data.push(attendance); 
        chart.labels.push(entity.name); 
      }
    }
    chart.datasets.push({
      data: data,
      fill: true
    })
    return chart; 
  }

  updateLineChart(attendance: {name: string, attendance: [string, IAttendance][]}[]) {
    let chart = {
      labels: null,
      datasets: []
    }
    for (let entity of attendance) {
      if (entity.attendance.length > 0) {
        let entryData = [];
        for (let entry of entity.attendance) {
          let total: number = entry[1].total;
          let present: number = entry[1].present;
          let attendance = Math.round((present / total) * 100);
          let data = {
            x: new Date(entry[0]),
            y: attendance
          }
          entryData.push(data);
        }
        let graphDataEntry = {
          data: entryData,
          label: entity.name,
          fill: false
        }
        chart.datasets.push(graphDataEntry);
      }
    }
    return chart; 
  }

  updateGenderBarChart(data: any[]) {

  }
}
