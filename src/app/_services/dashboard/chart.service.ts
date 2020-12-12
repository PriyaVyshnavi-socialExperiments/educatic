import { Injectable } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Chart } from 'chart.js'; 
// import the plugin core
import 'chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes';

// import a particular color scheme
import { Aspect6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';
import { IDashboardSchool } from 'src/app/_models/dashboard-models/dashboard-school';
import { IDashboardClassRoom } from 'src/app/_models/dashboard-models/dashboard-classroom';
import { IDashboardCity } from 'src/app/_models/dashboard-models/dashboard-city';
import { DateAdapter } from '@angular/material/core';
import { IDashboardStudent } from 'src/app/_models/dashboard-models/dashboard-student';

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

  constructor(
    private dashboardService: DashboardService,
  ) { }

  getStudentEnrollmentLineChart(id:string, xAxisTitle: string, yAxisTitle: string, title: string): Chart {
    return new Chart(document.getElementById(id), {
      type: "scatter",
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

  getAttendanceBarChart(id: string, xAxisTitle: string, yAxisTitle: string, title: string): Chart {
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

  getAttendanceLineChart(id: string, xAxisTitle: string, yAxisTitle: string, title: string): Chart {
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

  updateStudentEnrollmentLineChart(students: IDashboardStudent[], start: Date, end: Date) {
    let chart = {
      datasets: [],
      labels: null
    }
    let enrollments: Map<string, number> = new Map();
    if (students) {
      let data = [];
      for (let student of students) {
        if (new Date(student.enrollmentDate) >= start && new Date(student.enrollmentDate) <= end) {
          if (enrollments.get(student.enrollmentDate) == undefined) {
            enrollments.set(student.enrollmentDate, 0);
          }
          let curr: number = enrollments.get(student.enrollmentDate);
          enrollments.set(student.enrollmentDate, curr + 1); 
        }
      }
      for (let entry of enrollments.entries()) {
        let date: string = entry[0];
        let students: number = entry[1];
        data.push({
          x: date,
          y: students
        })
      }
      chart.datasets.push({
        data: data,
        label: "Student Enrollment",
        fill: false
      })
    }
    return chart;
  }

  updateAttendanceBarChart(info: IDashboardSchool[] | IDashboardClassRoom[] | IDashboardCity[], id: "classes" | "cities" | "schools", start: Date, end: Date) {
    let chart = {
      datasets: [],
      labels: []
    }
    if (info) {
      let attendance = this.dashboardService.getAttendance(info, id, start, end); 
      let data = [];
      for (let entity of attendance) {
        let total = 0;
        let present = 0;
        if (entity.attendance.length > 0) {
          for (let entry of entity.attendance) {
            total += entry[1].total;
            present += entry[1].present;
          }
          let attendance = this.getAttendancePercentage(total, present);
          data.push(attendance); 
          chart.labels.push(entity.name); 
        }
      }
      chart.datasets.push({
        data: data,
        fill: true
      })
    }    
    return chart; 
  }

  updateAttendanceLineChart(info: IDashboardSchool[] | IDashboardClassRoom[] | IDashboardCity[], id: "classes" | "cities" | "schools", start: Date, end: Date) {
    let chart = {
      labels: null,
      datasets: []
    }
    if (info) {
      let attendance = this.dashboardService.getAttendance(info, id, start, end); 
      for (let entity of attendance) {
        if (entity.attendance.length > 0) {
          let entryData = [];
          for (let entry of entity.attendance) {
            let total: number = entry[1].total;
            let present: number = entry[1].present;
            let attendance = this.getAttendancePercentage(total, present);
            let data = {
              x: entry[0],
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
    }
    return chart; 
  }

  updateGenderAttendanceBarChart(info: IDashboardSchool[] | IDashboardClassRoom[] | IDashboardCity[], id: "classes" | "cities" | "schools", start: Date, end: Date) {
    let chart = {
      datasets: [],
      labels: ["male", "female", "non-binary"]
    }
    if (info) {
      let attendance = this.dashboardService.getAttendance(info, id, start, end); 
      let maleTotal = 0;
      let femaleTotal = 0;
      let nonBinaryTotal = 0;
      let malePresent = 0;
      let femalePresent = 0;
      let nonBinaryPresent = 0;
      for (let entity of attendance) {
        if (entity.attendance.length > 0) {
          for (let entry of entity.attendance) {
            maleTotal += entry[1].male.total;
            femaleTotal += entry[1].female.total;
            nonBinaryTotal += entry[1].nonBinary.total;
            malePresent += entry[1].male.present;
            femalePresent += entry[1].female.present;
            nonBinaryPresent += entry[1].nonBinary.present;
          }
        }
      }
      chart.datasets.push({
        data: [this.getAttendancePercentage(maleTotal, malePresent), this.getAttendancePercentage(femaleTotal, femalePresent), 
          this.getAttendancePercentage(nonBinaryTotal, nonBinaryPresent)],
        fill: true
      })
    }
    return chart; 
  }

  getAttendancePercentage(total: number, present: number): number {
    return Math.round(present / total * 100); 
  }
}
