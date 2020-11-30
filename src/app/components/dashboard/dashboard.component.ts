import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../graphs/modal/modal.page';
import { DashboardService } from '../../_services/dashboard/dashboard.service';
import { Chart } from 'chart.js';
import { ISchool } from '../../_models/school';
import { IClassRoom } from '../../_models/class-room';
import { IStudent } from '../../_models/student';
import { AnyNsRecord } from 'dns';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit { 
  data: any;
  start: Date; 
  end: Date;
  cities: {name: string, id: string}[] = [];
  schools: {name: string, id: string, city: string}[] = [];
  classes: {name: string, id: string, school: string}[] = [];
  allCities: {name: string, id: string}[] = []; 
  allSchools: {name: string, id: string, city: string}[] = [];
  allClasses: {name: string, id: string, school: string}[] = [];
  charts: any = {
    'city-attendance': undefined, 
    'school-attendance': undefined,
    'class-attendance': undefined,
    'gender-attendance': undefined,
  };

  classChartData = {
    labels: null,
    datasets: []
  };

  schoolChartData = {
    labels: [],
    datasets: []
  };

  cityChartData = {
    labels: [],
    datasets: []
  }

  genderChartData = { 
    labels: [],
    datasets: []
  }

  constructor
    (
      public modalController: ModalController, 
      public dash: DashboardService,
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
    this.dash.getTables().subscribe((result) => {
      this.dash.processData(result[0], result[1]);
      if (!this.charts['city-attendance'] && !this.charts['school-attendance'] && !this.charts['class-attendance']) {
        this.charts['city-attendance'] = this.dash.getBarChart('city-attendance','Cities', 'Percent Attendance', 'City Attendance'); 
        this.charts['school-attendance'] = this.dash.getBarChart('school-attendance', 'Schools', 'Percent Attendance', 'School Attendance');
        this.charts['class-attendance'] = this.dash.getLineChart('class-attendance', 'Days', 'Percent Attendance', 'Class Attendance');
      }
      this.allCities = this.dash.getCities();
      this.cities = this.allCities; 
      this.changeCities();
      this.schools = this.allSchools;
      this.changeSchools();
      this.classes = this.allClasses; 
      this.changeClasses();
    })
  }

  changeCities() {
    this.allSchools = [];
    if (this.cities) {
      this.cities.forEach((city) => {
        let schools: {name: string, id: string, city: string}[] = this.dash.getSchools(city); 
        for (let school of schools) {
          this.allSchools.push(school);
        }
      })
    }
    this.changeSchools();
    this.updateCityChartData();
  }

  changeSchools() {
    this.allClasses = [];
    if (this.schools) {
      this.schools.forEach((school) => {
        let classRooms: {name: string, id: string, school: string}[] = this.dash.getClasses(school);
        for (let classRoom of classRooms) {
          this.allClasses.push(classRoom); 
        }
      });
    }
    this.updateSchoolChartData();
  }

  changeClasses() {
    this.classChartData = this.dash.updateAttendanceLineChart(this.classes, 'classes');
    this.updateChart('class-attendance', this.classChartData); 
  }

  updateSchoolChartData() {
    this.schoolChartData = this.dash.updateAttendanceBarChart(this.schools, 'schools');
    this.updateChart('school-attendance', this.schoolChartData); 
  }

  updateCityChartData() {
    this.cityChartData = this.dash.updateAttendanceBarChart(this.cities, 'cities'); 
    this.updateChart('city-attendance', this.cityChartData);
  }

  // updateGenderChartData(id: string) {
  //   this.genderChartData = this.dash.updateGenderBarChart(this[id]);
  //   this.updateChart('gender-attendance', this.genderChartData); 
  // }

  updateChart(id: string, chartData: any) {
    if (this.charts[id]) {
      this.charts[id].data.datasets = chartData.datasets; 
      this.charts[id].data.labels = chartData.labels;
      this.charts[id].update();
    }
  }

  changeStartDate($event) {
    console.log((<HTMLTextAreaElement>event.target).value);
    let start = new Date((<HTMLTextAreaElement>event.target).value); 
    if (this.end && start >= this.end) {
      alert("Start date must be before end date"); 
    } else {
      this.start = start; 
    }
    this.changeCities();
  }

  changeEndDate($event) {
    console.log((<HTMLTextAreaElement>event.target).value);
    let end = new Date((<HTMLTextAreaElement>event.target).value); 
    if (this.start && end <= this.start) {
      alert("End date must be after start date"); 
    } else {
      this.end = end; 
    }
    this.changeCities(); 
  }
}
