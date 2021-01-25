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
import { IDashboardStudent } from 'src/app/_models/dashboard-models/dashboard-student';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(
    private dashboardService: DashboardService,
  ) { }

  /**
   * Returns reference to now initialized student enrollment scatter chart. 
   * @param id id of canvas where chart should be displayed 
   * @param xAxisTitle x-axis title
   * @param yAxisTitle y-axis title
   * @param title title of graph 
   */
  getStudentEnrollmentLineChart(id:string, xAxisTitle: string, yAxisTitle: string, title: string): Chart {
    return new Chart(document.getElementById(id), {
      type: "line",
      data: {
          labels: null,
          datasets: []
      },
      options: {
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              let item = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              return item.y + " new students";
            }
          }
        },
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

  /**
   * Returns a reference to a general attendance bar chart (can be used for schools, cities, or classRooms)
   * @param id id of canvas where chart should be displayed 
   * @param xAxisTitle x-axis title
   * @param yAxisTitle y-axis title
   * @param title title of graph 
   */
  getAttendanceBarChart(id: string, xAxisTitle: string, yAxisTitle: string, title: string): Chart {
    return new Chart(document.getElementById(id), {
      type: "bar",
      data: {
          labels: null,
          datasets: []
      },
      options: {
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              let item = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              return item.y + '%'; //Add percentage
            },
            afterLabel: function(tooltipItem, data) {
              let item = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              return "Cumulative Total Students: " + item.total + "\nCumulative Present Students: " + item.present;
            } 
          }
        },
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

  /**
   * Returns a reference to a general attendance line chart (can be used for schools, cities, or classRooms). 
   * Uses time as the x-axis 
   * @param id id of canvas where chart should be displayed 
   * @param xAxisTitle x-axis title
   * @param yAxisTitle y-axis title
   * @param title title of graph 
   */
  getAttendanceLineChart(id: string, xAxisTitle: string, yAxisTitle: string, title: string): Chart {
    return new Chart(document.getElementById(id), {
      type: "line",
      data: {
          labels: null,
          datasets: []
      },
      options: {
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              let item = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              return item.y + '%'; //Add percentage
            },
            afterLabel: function(tooltipItem, data) {
              let item = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              return "Total Students: " + item.total + "\nPresent Students: " + item.present;
            } 
          }
       },
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

  /**
   * Returns updated data for the student enrollment line chart within start/end date. 
   * @param students list of selected students
   * @param start start date
   * @param end end date 
   */
  updateStudentEnrollmentLineChart(students: IDashboardStudent[], start: Date, end: Date) {
    let chart = {
      datasets: [],
      labels: null
    }
    let enrollments: Map<string, number> = new Map();
    if (students) {
      let data = [];
      for (let student of students) {
        let date = new Date(student.enrollmentDate);
        if (date >= start && date <= end) {
          if (enrollments.get(student.enrollmentDate) == undefined) {
            enrollments.set(student.enrollmentDate, 0);
          }
          let curr: number = enrollments.get(student.enrollmentDate);
          enrollments.set(student.enrollmentDate, curr + 1); 
        }
      }
      for (let entry of enrollments.entries()) {
        let dateEntry: Date = new Date(entry[0]);
        let students: number = entry[1];
        data.push({
          x: dateEntry,
          y: students,
        })
      }
      data.sort((a, b) => {
        if (a.x > b.x) {
          return 1;
        } else {
          return -1;
        }
      })
      chart.datasets.push({
        data: data,
        label: "Student Enrollment",
        fill: false
      })
    }
    return chart;
  }

  /**
   * Updates data for the generic attendance bart chart
   * @param info selected schools, classes, or cities
   * @param id id corresponding to type (used in the dashboard service to access correct field in this.data)
   * @param start start date
   * @param end end date 
   */
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
          let obj = {
            x: entity.name,
            y: attendance,
            total: total,
            present: present
          }
          chart.labels.push(entity.name);
          data.push(obj); 
        }
      }
      chart.datasets.push({
        data: data,
        fill: true
      })
    }    
    return chart; 
  }

  /**
   * Updates data of general attendance line chart
   * @param info selected schools, classes, or cities
   * @param id id corresponding to field storing all data for classes/cities/schools in the dashboard service
   * @param start start date
   * @param end end date 
   */
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
              y: attendance,
              total: total,
              present: present
            }
            entryData.push(data);
          }
          entryData.sort((a, b) => {
            if (a.x > b.x) {
              return 1;
            } else {
              return -1;
            }
          })
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

  /**
   * Updates general gender attendance bar chart 
   * @param info selected schools, classes, or cities
   * @param id id corresponding to field storing all data for classes/cities/schools in the dashboard service
   * @param start start date
   * @param end end date
   */
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
      let maleObj = {
        x: "male",
        y: this.getAttendancePercentage(maleTotal, malePresent),
        total: maleTotal,
        present: malePresent,
      };
      let femaleObj = {
        x: "female",
        y: this.getAttendancePercentage(femaleTotal, femalePresent),
        total: femaleTotal,
        present: femalePresent,
      }; 
      let nonBinaryObj = {
        x: "non-binary",
        y: this.getAttendancePercentage(nonBinaryTotal, nonBinaryPresent),
        total: nonBinaryTotal,
        present: nonBinaryPresent,
      }
      chart.datasets.push({
        data: [maleObj, femaleObj, nonBinaryObj],
        fill: true
      })
    }
    return chart; 
  }

  /**
   * Rounds average attendance (#present students / #total students) to nearest whole percent and returns it. 
   * @param total 
   * @param present 
   */
  getAttendancePercentage(total: number, present: number): number {
    return Math.round(present / total * 100); 
  }
}
