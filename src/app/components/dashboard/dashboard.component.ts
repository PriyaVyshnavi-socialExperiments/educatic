import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPopUpComponent } from '../dashboard-helpers/modal-pop-up/modal-pop-up.component';
import { DashboardService } from '../../_services/dashboard/dashboard.service';
import { ChartService }from '../../_services/dashboard/chart.service';
import { Chart } from 'chart.js';
import { IDashboardCity } from '../../_models/dashboard-models/dashboard-city'; 
import { IDashboardSchool } from '../../_models/dashboard-models/dashboard-school'; 
import { IDashboardClassRoom } from '../../_models/dashboard-models/dashboard-classroom'; 
import { IDashboardStudent } from '../../_models/dashboard-models/dashboard-student'; 
import { IDashboardTeacher } from '../../_models/dashboard-models/dashboard-teacher';
import { ToastController } from  '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit { 
  startDate: string = "5-26-2020"; 
  endDate: string = "12-26-2020";
  start: Date = new Date("5-26-2020"); // Need to convert the startDate/endDate to dates to allow comparison 
  end: Date = new Date("12-26-2020");

  // Currently selected cities, schools, classes, students, and teachers
  cities: IDashboardCity[] = [];
  schools: IDashboardSchool[] = [];
  classes: IDashboardClassRoom[] = [];
  students: IDashboardStudent[] = [];
  teachers: IDashboardTeacher[] = []; 

  // All cities, all schools that correspond to the selected cities, and all classes corresponding to the selected schools. 
  // Used to populate the select options. 
  allCities: IDashboardCity[] = []; 
  allSchools: IDashboardSchool[] = [];
  allClasses: IDashboardClassRoom[] = [];
  
  // Object containg mappings from id of canvas you want chart displayed to the actual chart object 
  charts: any = {
    'city-attendance': undefined, 
    'school-attendance': undefined,
    'class-attendance': undefined,
    'gender-attendance': undefined,
    'student-enrollment': undefined,
  };

  // Used to display the static cards 
  totalClasses: number = 0;
  totalSchools: number = 0;
  totalStudents: number = 0;
  totalTeachers: number = 0; 
  activeClasses: number = 0;
  activeSchools: number = 0;
  activeStudents: number = 0;
  activeTeachers: number = 0; 

  constructor
    (
      public modalController: ModalController, 
      public dashboardService: DashboardService,
      public toastController: ToastController,
      public chartService: ChartService,
    ) 
    {}

  /**
   * When a char is clicked, displays modal-pop-up with the selected chart
   * @param chart selected chart
   * @param type type of chart to be displayed (bar, line, scatter, etc....). 
   */
  async presentModal(chart: Chart, type: String) {
    const modal = await this.modalController.create({
      component: ModalPopUpComponent,
      componentProps: {
        'chart': chart,
        'type': type
      }
    })
    return await modal.present();
  }

  /**
   * First initializes all charts. Makes calls chartService to do this. General format of chart initalizer 
   * is to pass in the id of the canvas where chart should be displayed, the x-axis title, y-axis title, and the title. 
   * 
   * Calls refresh to initialize dashboard. 
   */
  ngOnInit() {
    if (!this.charts['city-attendance'] && !this.charts['school-attendance'] && !this.charts['class-attendance'] && !this.charts['gender-attendance']) {
      this.charts['city-attendance'] = this.chartService.getAttendanceBarChart('city-attendance','Cities', 'Percent Attendance', 'City Attendance'); 
      this.charts['school-attendance'] = this.chartService.getAttendanceBarChart('school-attendance', 'Schools', 'Percent Attendance', 'School Attendance');
      this.charts['class-attendance'] = this.chartService.getAttendanceLineChart('class-attendance', 'Days', 'Percent Attendance', 'Class Attendance');
      this.charts['gender-attendance'] = this.chartService.getAttendanceBarChart('gender-attendance', 'Gender', 'Percent Attendance', 'Gender Attendance');
      this.charts['student-enrollment'] = this.chartService.getStudentEnrollmentLineChart('student-enrollment', 'Days', 'Number of Students', 'Student Enrollment');
    }
    this.refresh();
  }

  /**
   * Refreshes data by making call to the dashboardService. This updates the data currently used to display 
   * the dashboard. If there is an error, displays message to the user that the data failed to load.  
   */
  refresh() {
    try {
      this.dashboardService.getData().subscribe(() => {
        // After loading data, geocode the schools addresses to get latitude and longitude 
        this.dashboardService.geocodeSchools().subscribe(() => {
          this.allCities = this.dashboardService.getCities();
          this.cities = this.allCities; 
          this.changeCities();
          this.schools = this.allSchools;
          this.changeSchools();
          this.classes = this.allClasses; 
          this.changeClasses();
          this.totalSchools = this.allSchools.length;
          this.totalClasses = this.allClasses.length;  
          this.totalStudents = this.students.length; 
          this.totalTeachers = this.teachers.length; 
        })
      });
    } catch (error) {
      this.presentToast("Failed to load data");
    }
  }

  /**
   * Changes the cities when selection changes. This then trickles down so that now all 
   * schools and classes within the selected cities are also selected. It also recalculates the average 
   * attendance of all schools and sorts the schools in order to their average attendance. 
   * 
   * Changes selected schools and classes to include all schools/classes in the newly selected cities. 
   */
  changeCities() {
    this.allSchools = [];
    if (this.cities) {
      this.cities.forEach((city) => {
        this.allSchools = this.allSchools.concat(city.schools);
      });
      // Calculate average attendance
      for (let school of this.allSchools) {
        school.averageAttendance = this.dashboardService.getCumulativeAttendance(school, 'schools', this.start, this.end);
      }
      // Sorts schools based on average attendance 
      this.allSchools.sort((s1: IDashboardSchool, s2: IDashboardSchool) => {
        if (s1.averageAttendance > s2.averageAttendance) {
          return -1;
        } else {
          return 1;
        }
      })
      this.schools = this.allSchools; 
    }
    // Updates schools to reflect newly selected cities and the city attendance chart 
    this.changeSchools();
    this.updateCityChartData();
  }

  /**
   * Changes the schools when the selection changes. This then trickles down so that now all classes 
   * within the selected schools are selected. It also recalculates the average attendance of each class 
   * and sortes classes based on this attendance.  
   * 
   * Changes selected classes to include all classes in the newly selected schools. 
   */
  changeSchools() {
    this.allClasses = [];
    this.teachers = [];
    if (this.schools) {
      this.schools.forEach((school) => {
        this.teachers = this.teachers.concat(school.teachers); 
        this.allClasses = this.allClasses.concat(school.classRooms); 
      });
      // Calculate average attendance for each class
      for (let classRoom of this.allClasses) {
        classRoom.averageAttendance = this.dashboardService.getCumulativeAttendance(classRoom, 'classes', this.start, this.end); 
      }
      // Sort classes based on attendance 
      this.allClasses.sort((c1: IDashboardClassRoom, c2: IDashboardClassRoom) => {
        if (c1.averageAttendance > c2.averageAttendance) {
          return -1;
        } else {
          return 1;
        }
      })
      this.classes = this.allClasses; 
      // Updates active schools and active teachers 
      this.activeSchools = this.dashboardService.getActiveSchools(this.schools, this.start, this.end);
      this.activeTeachers = this.dashboardService.getActiveTeachers(this.teachers, this.start, this.end);
    }
    // Updates classes to reflect newly selected schools and updates school attendance chart. 
    this.changeClasses(); 
    this.updateSchoolChartData();
  }

  /**
   * Changes the classes and updates the student enrollment chart based on the students within all these classes. 
   */
  changeClasses() {
    this.students = [];
    if (this.classes) {
      this.classes.forEach((classRoom) => {
        this.students = this.students.concat(classRoom.students); 
      });
      // Updates active classes and students 
      this.activeClasses = this.dashboardService.getActiveClasses(this.classes, this.start, this.end);
      this.activeStudents = this.dashboardService.getActiveStudents(this.students, this.start, this.end);
    }
    // Updates student enrollment chart, gender attendance chart, and class chart. 
    this.updateStudentEnrollmentChartData();
    this.updateGenderChartData();
    this.updateClassChartData(); 
  }

  // Updates data for gender attendance chart (second param is how granular you want gender attendance to be, can 
  // be classes, schools, or cities. If you update, you should move the call to updateGenderChartData to 
  // the approprate "change" method (changeClasses, changeSchools, changeCities)). 
  updateGenderChartData() {
    let genderChartData = this.chartService.updateGenderAttendanceBarChart(this.classes, 'classes', this.start, this.end);
    this.updateChart('gender-attendance', genderChartData); 
  }

  // Updates class chart data. updateAttendanceLineChart takes the data, the type (classes, schools, or cities), and the 
  // start/end date. 
  updateClassChartData() {
    let classChartData = this.chartService.updateAttendanceLineChart(this.classes, 'classes', this.start, this.end);
    this.updateChart('class-attendance', classChartData); 
  }

  updateSchoolChartData() {
    let schoolChartData = this.chartService.updateAttendanceBarChart(this.schools, 'schools', this.start, this.end);
    this.updateChart('school-attendance', schoolChartData); 
  }

  updateCityChartData() {
    let cityChartData = this.chartService.updateAttendanceBarChart(this.cities, 'cities', this.start, this.end); 
    this.updateChart('city-attendance', cityChartData);
  }

  updateStudentEnrollmentChartData() {
    let studentEnrollmentChartData = this.chartService.updateStudentEnrollmentLineChart(this.students, this.start, this.end);
    this.updateChart('student-enrollment', studentEnrollmentChartData);
  }

  /**
   * Updates the appropriate chart with new data 
   * @param id id of chart canvas to be updated
   * @param chartData data for chart o now display 
   */
  updateChart(id: string, chartData: any) {
    if (this.charts[id]) {
      this.charts[id].data.datasets = chartData.datasets; 
      this.charts[id].data.labels = chartData.labels;
      this.charts[id].update();
    }
  }

  /**
   * Changes the start data. First checks to see if start < end, if it is, sets start to be new startData
   */
  async changeStartDate() {
    let start = new Date(this.startDate); 
    if (this.end && start >= this.end) {
      await this.presentToast("Start date must be before end date");
      this.startDate = this.start.toString(); 
    } else {
      this.start = start; 
    }
    this.changeCities();
  }

  /**
   * Changes the end data. First checks to see if end > staart. If it is, sets end to be new endDate. 
   */
  async changeEndDate() {
    let end = new Date(this.endDate); 
    if (this.start && end <= this.start) {
      await this.presentToast("End date must be after start date");
      this.endDate = this.end.toString();
    } else {
      this.end = end; 
    }
    this.changeCities(); 
  }
  /**
   * Error message to be displayed to user 
   * @param msg error message to be displayed
   */
  private async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      color: 'danger',
      duration: 3000,
      buttons: [{
        text: 'Close',
        role: 'cancel',
      }
      ]
    });
    toast.present();
  }
}
