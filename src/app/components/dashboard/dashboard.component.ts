import { Component, OnInit, AfterViewInit } from '@angular/core';
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
import { SchoolService } from '../../_services/school/school.service';
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit { 
  
  start: Date = new Date("5-26-2020"); // Need to convert the startDate/endDate to dates to allow comparison 
  end: Date = new Date();
  startDate: string = "5-26-2020"; 
  endDate: string = this.end.toString();

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

  // Ids of canvas's where charts will be displayed 
  cityAttendanceChartId: string = 'city-attendance';
  schoolAttendanceChartId: string = 'school-attendance';
  classAttendanceChartId: string = 'class-attendance';
  genderAttendanceChartId: string = 'gender-attendance';
  studentEnrollmentChartId: string = 'student-enrollment';
  
  // Object containg mappings from id of canvas you want chart displayed to the actual chart object 
  charts: any = {
    [this.cityAttendanceChartId]: undefined, 
    [this.schoolAttendanceChartId]: undefined,
    [this.classAttendanceChartId]: undefined,
    [this.genderAttendanceChartId]: undefined,
    [this.studentEnrollmentChartId]: undefined,
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
      public schoolService: SchoolService,
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
  async ngAfterViewInit() {
    try {
      if (!this.charts[this.cityAttendanceChartId] && !this.charts[this.schoolAttendanceChartId] && !this.charts[this.classAttendanceChartId] && !this.charts[this.genderAttendanceChartId] && !this.charts[this.studentEnrollmentChartId]) {
        this.charts[this.cityAttendanceChartId] = this.chartService.getAttendanceBarChart(this.cityAttendanceChartId,'Cities', 'Percent Attendance', 'City Attendance'); 
        this.charts[this.schoolAttendanceChartId] = this.chartService.getAttendanceBarChart(this.schoolAttendanceChartId, 'Schools', 'Percent Attendance', 'School Attendance');
        this.charts[this.classAttendanceChartId] = this.chartService.getAttendanceLineChart(this.classAttendanceChartId, 'Days', 'Percent Attendance', 'Class Attendance');
        this.charts[this.genderAttendanceChartId] = this.chartService.getAttendanceBarChart(this.genderAttendanceChartId, 'Gender', 'Percent Attendance', 'Gender Attendance');
        this.charts[this.studentEnrollmentChartId] = this.chartService.getStudentEnrollmentLineChart(this.studentEnrollmentChartId, 'Days', 'Number of Students', 'Student Enrollment');
      }
      this.refresh();
    } catch (error) {
      await this.presentToast("Failed to initalize charts and/or dasboard infromation. Please try again later."); 
    }
   
  }

  /**
   * Refreshes data by making call to the dashboardService. This updates the data currently used to display 
   * the dashboard. If there is an error, displays message to the user that the data failed to load.  
   */
  async refresh() {
    try {
      this.dashboardService.getData().subscribe(() => {
        // After loading data, geocode the schools addresses to get latitude and longitude 
        this.dashboardService.geocodeSchools().subscribe(() => {
          this.updateCities(); 
          this.changeCities();
          this.changeSchools();
          this.changeClasses();
          this.totalSchools = this.allSchools.length;
          this.totalClasses = this.allClasses.length;  
          this.totalStudents = this.students.length; 
          this.totalTeachers = this.teachers.length; 
        })
      });
    } catch (error) {
      await this.presentToast("Error: Failed to load data");
    }
  }

  /**
   * This method updates the average attendance of each city and sorts them in order of average attendance to 
   * ensure that cities with high attendance are displayed first on the list. 
   */
  async updateCities() {
    try {
      this.allCities = this.dashboardService.getCities();
      for (let city of this.allCities) {
        city.averageAttendance = this.dashboardService.getAverageCityAttendance(city, this.start, this.end);
      }
      this.cities = this.allCities; 
    } catch (error) {
      await this.presentToast("Error: Failed to update cities");
    }
    
  }

  /**
   * Changes the cities when selection changes. This then trickles down so that now all 
   * schools and classes within the selected cities are also selected. It also recalculates the average 
   * attendance of all schools and sorts the schools in order to their average attendance. 
   * 
   * Changes selected schools and classes to include all schools/classes in the newly selected cities. 
   */
  async changeCities() {
    try {
      this.allSchools = [];
      if (this.cities) {
        this.cities.forEach((city) => {
          this.allSchools = this.allSchools.concat(city.schools);
        });
        // Calculate average attendance
        for (let school of this.allSchools) {
          school.averageAttendance = this.dashboardService.getAverageSchoolAttendance(school, this.start, this.end);
        }
        // Sorts schools based on average attendance 
        this.schools = this.allSchools; 
        this.schools.sort((s1: IDashboardSchool, s2: IDashboardSchool) => {
          return s1.averageAttendance > s2.averageAttendance ? -1 : 1;
        })
      }
      // Updates schools to reflect newly selected cities and the city attendance chart 
      this.changeSchools();
      this.updateCityChartData();
    } catch (error) {
      await this.presentToast("Error: Failed to change cities");
    }
  }

  /**
   * Changes the schools when the selection changes. This then trickles down so that now all classes 
   * within the selected schools are selected. It also recalculates the average attendance of each class 
   * and sortes classes based on this attendance.  
   * 
   * Changes selected classes to include all classes in the newly selected schools. 
   */
  async changeSchools() {
    try {
      this.allClasses = [];
      this.teachers = [];
      if (this.schools) {
        this.schools.forEach((school) => {
          this.teachers = this.teachers.concat(school.teachers); 
          this.allClasses = this.allClasses.concat(school.classRooms); 
        });
        // Calculate average attendance for each class
        for (let classRoom of this.allClasses) {
          classRoom.averageAttendance = this.dashboardService.getAverageClassRoomAttendance(classRoom, this.start, this.end); 
        }

        // Sort classes based on attendance 
        this.classes = this.allClasses; 
        this.classes.sort((c1: IDashboardClassRoom, c2: IDashboardClassRoom) => {
          return c1.averageAttendance > c2.averageAttendance ? -1: 1;
        });

        // Updates active schools and active teachers 
        this.activeSchools = this.dashboardService.getActiveSchools(this.schools, this.start, this.end);
        this.activeTeachers = this.dashboardService.getActiveTeachers(this.teachers, this.start, this.end);
      }
      // Updates classes to reflect newly selected schools and updates school attendance chart. 
      this.changeClasses(); 
      this.updateSchoolChartData();
    } catch (error) {
      await this.presentToast("Error: Failed to change schools");
    }
  }

  /**
   * Changes the classes and updates the student enrollment chart based on the students within all these classes. 
   */
  async changeClasses() {
    try {
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
    } catch (error) {
      await this.presentToast("Error: Failed to change classes.");
    }
  }

  // Updates data for gender attendance chart (second param is how granular you want gender attendance to be, can 
  // be classes, schools, or cities. If you update, you should move the call to updateGenderChartData to 
  // the approprate "change" method (changeClasses, changeSchools, changeCities)). 
  async updateGenderChartData() {
    try {
      let genderChartData = this.chartService.updateGenderAttendanceBarChart(this.classes, 'classes', this.start, this.end);
      this.updateChart(this.genderAttendanceChartId, genderChartData); 
    } catch (error) {
      await this.presentToast("Error: Failed to update gender attendance chart");
    }
    
  }

  // Updates class chart data. updateAttendanceLineChart takes the data, the type (classes, schools, or cities), and the 
  // start/end date. 
  async updateClassChartData() {
    try {
      let classChartData = this.chartService.updateAttendanceLineChart(this.classes, 'classes', this.start, this.end);
      this.updateChart(this.classAttendanceChartId, classChartData); 
    } catch (error) {
      await this.presentToast("Error: Failed to update class attendance chart");
    }
  }

  async updateSchoolChartData() {
    try {
      let schoolChartData = this.chartService.updateAttendanceBarChart(this.schools, 'schools', this.start, this.end);
      this.updateChart(this.schoolAttendanceChartId, schoolChartData); 
    } catch (error) {
      await this.presentToast("Error: Failed to update school attendance chart");
    }
   
  }

  async updateCityChartData() {
    try {
      let cityChartData = this.chartService.updateAttendanceBarChart(this.cities, 'cities', this.start, this.end); 
      this.updateChart(this.cityAttendanceChartId, cityChartData);
    } catch (error) {
      await this.presentToast("Error: Failed to update city attendance chart");
    }

  }

  async updateStudentEnrollmentChartData() {
    try {
      let studentEnrollmentChartData = this.chartService.updateStudentEnrollmentLineChart(this.students, this.start, this.end);
      this.updateChart(this.studentEnrollmentChartId, studentEnrollmentChartData);
    } catch (error) {
      await this.presentToast("Error: Failed to update student enrollment chart");
    }
  }

  /**
   * Updates the appropriate chart with new data 
   * @param id id of chart canvas to be updated
   * @param chartData data for chart o now display 
   */
  async updateChart(id: string, chartData: any) {
    try {
      if (this.charts[id]) {
        this.charts[id].data.datasets = chartData.datasets; 
        this.charts[id].data.labels = chartData.labels;
        this.charts[id].update();
      }
    } catch (error) {
      await this.presentToast("Error: Failed to update charts");
    }
    
  }

  /**
   * Changes the start data. First checks to see if start < end, if it is, sets start to be new startData
   */
  async changeStartDate() {
    try {
      let start = new Date(this.startDate); 
      if (this.end && start >= this.end) {
        await this.presentToast("Start date must be before end date");
        this.startDate = this.start.toString(); 
      } else {
        this.start = start; 
      }
      this.updateCities();
      this.changeCities();
    } catch (error) {
      await this.presentToast("Faile to change start date");
    }

  }

  /**
   * Changes the end data. First checks to see if end > staart. If it is, sets end to be new endDate. 
   */
  async changeEndDate() {
    try {
      let end = new Date(this.endDate); 
      if (this.start && end <= this.start) {
        await await this.presentToast("End date must be after start date");
        this.endDate = this.end.toString();
      } else {
        this.end = end; 
      }
      this.updateCities(); 
      this.changeCities(); 
    } catch (error) {
      await this.presentToast("Error: Failed to change end date");
    }  
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
