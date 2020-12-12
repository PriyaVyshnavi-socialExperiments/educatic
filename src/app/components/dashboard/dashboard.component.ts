import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../graphs/modal/modal.page';
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
  startDate: string = "2020-5-26";
  endDate: string = "2020-12-26";
  start: Date = new Date("2020-5-26"); 
  end: Date = new Date("2020-11-26");
  cities: IDashboardCity[] = [];
  schools: IDashboardSchool[] = [];
  classes: IDashboardClassRoom[] = [];
  allCities: IDashboardCity[] = []; 
  allSchools: IDashboardSchool[] = [];
  allClasses: IDashboardClassRoom[] = [];
  allStudents: IDashboardStudent[] = [];
  allTeachers: IDashboardTeacher[] = []; 

  // Object containg mappings from id of canvas you want chart displayed to the actual chart object 
  charts: any = {
    'city-attendance': undefined, 
    'school-attendance': undefined,
    'class-attendance': undefined,
    'gender-attendance': undefined,
    'student-enrollment': undefined,
  };

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


  async presentModal(chart: Chart, type: String) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        'chart': chart,
        'type': type
      }
    })
    return await modal.present();
  }

  ngOnInit() {
    try {
      if (!this.charts['city-attendance'] && !this.charts['school-attendance'] && !this.charts['class-attendance'] && !this.charts['gender-attendance']) {
        this.charts['city-attendance'] = this.chartService.getAttendanceBarChart('city-attendance','Cities', 'Percent Attendance', 'City Attendance'); 
        this.charts['school-attendance'] = this.chartService.getAttendanceBarChart('school-attendance', 'Schools', 'Percent Attendance', 'School Attendance');
        this.charts['class-attendance'] = this.chartService.getAttendanceLineChart('class-attendance', 'Days', 'Percent Attendance', 'Class Attendance');
        this.charts['gender-attendance'] = this.chartService.getAttendanceBarChart('gender-attendance', 'Gender', 'Percent Attendance', 'Gender Attendance');
        this.charts['student-enrollment'] = this.chartService.getStudentEnrollmentLineChart('student-enrollment', 'Days', 'Number of Students', 'Student Enrollment');
      }
      this.loadData(); 
    } catch (error) {
      this.presentToast("Failed to load data");
    }
  }

  loadData = () => {
    try {
      this.dashboardService.getData().subscribe(() => {
        this.allCities = this.dashboardService.getCities();
        this.cities = this.allCities; 
        this.changeCities();
        this.schools = this.allSchools;
        this.changeSchools();
        this.classes = this.allClasses; 
        this.changeClasses();
        this.totalSchools = this.allSchools.length;
        this.totalClasses = this.allClasses.length;  
        this.totalStudents = this.allStudents.length; 
        this.totalTeachers = this.allTeachers.length;  
      });
    } catch (error) {
      this.presentToast("Failed to load data");
    }
  }

  /**
   * Changes the cities when selection changes. This then trickles down so that now all 
   * schools and classes within the selected cities are also selected. 
   */
  changeCities() {
    this.allSchools = [];
    if (this.cities) {
      this.cities.forEach((city) => {
        this.allSchools = this.allSchools.concat(city.schools);
      })
      this.schools = this.allSchools; 
    }
    this.changeSchools();
    this.updateCityChartData();
  }

  /**
   * Changes the schools when the selection changes. This then trickles down so that now all classes 
   * within the selected schools are selected. 
   */
  changeSchools() {
    this.allClasses = [];
    this.allTeachers = [];
    if (this.schools) {
      this.schools.forEach((school) => {
        this.allTeachers = this.allTeachers.concat(school.teachers); 
        this.allClasses = this.allClasses.concat(school.classRooms); 
      });
      this.classes = this.allClasses; 
      this.activeSchools = this.dashboardService.getActiveSchools(this.schools, this.start, this.end);
      this.activeTeachers = this.dashboardService.getActiveTeachers(this.allTeachers, this.start, this.end);
    }
    this.changeClasses(); 
    this.updateSchoolChartData();
  }

  /**
   * Changes the classes and updates the student enrollment chart based on the students within all these classes. 
   */
  changeClasses() {
    this.allStudents = [];
    if (this.classes) {
      this.classes.forEach((classRoom) => {
        this.allStudents = this.allStudents.concat(classRoom.students); 
      });
      this.activeClasses = this.dashboardService.getActiveClasses(this.classes, this.start, this.end);
      this.activeStudents = this.dashboardService.getActiveStudents(this.allStudents, this.start, this.end);
    }
    this.updateStudentEnrollmentChartData();
    this.updateGenderChartData();
    this.updateClassChartData(); 
  }

  updateGenderChartData() {
    let genderChartData = this.chartService.updateGenderAttendanceBarChart(this.classes, 'classes', this.start, this.end);
    this.updateChart('gender-attendance', genderChartData); 
  }

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
    let studentEnrollmentChartData = this.chartService.updateStudentEnrollmentLineChart(this.allStudents, this.start, this.end);
    this.updateChart('student-enrollment', studentEnrollmentChartData);
  }

  updateChart(id: string, chartData: any) {
    if (this.charts[id]) {
      this.charts[id].data.datasets = chartData.datasets; 
      this.charts[id].data.labels = chartData.labels;
      this.charts[id].update();
    }
  }

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

  async changeEndDate($event) {
    let end = new Date(this.endDate); 
    if (this.start && end <= this.start) {
      await this.presentToast("End date must be after start date");
      this.endDate = this.end.toString();
    } else {
      this.end = end; 
    }
    this.changeCities(); 
  }

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
