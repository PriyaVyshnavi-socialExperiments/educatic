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
  cities = [];
  schools: ISchool[] = [];
  classes: any[] = [];
  allCities = []; 
  allSchools: ISchool[] = [];
  allClasses: any[] = [];
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
      this.data = this.dash.processData(result[0], result[1]);
      this.cities = [];
      for (let city of this.data.cities.keys()) {
        this.cities.push({
          id: city,
          name: city
        }); 
      }
      if (!this.charts['city-attendance'] && !this.charts['school-attendance'] && !this.charts['class-attendance']) {
        this.charts['city-attendance'] = this.dash.getBarChart('city-attendance','Cities', 'Percent Attendance', 'City Attendance'); 
        this.charts['school-attendance'] = this.dash.getBarChart('school-attendance', 'Schools', 'Percent Attendance', 'School Attendance');
        this.charts['class-attendance'] = this.dash.getLineChart('class-attendance', 'Days', 'Percent Attendance', 'Class Attendance');
      }
      this.allCities = this.cities;
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
        for (let school of this.data.cities.get(city.id).schools) {
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
        if (school && school.classRooms) {
          for (let classRoom of school.classRooms) {
            let temp: any = classRoom; 
            temp.name = classRoom.classRoomName;
            temp.id = classRoom.classId; 
            this.allClasses.push(temp);
          }
        }
      });
    }
    this.updateSchoolChartData();
  }

  changeClasses() {
    this.classChartData = this.dash.updateClassLineChart(this.classes);
    this.updateChart('class-attendance', this.classChartData); 
  }

  updateSchoolChartData() {
    this.schoolChartData = this.dash.updateSchoolBarChart(this.schools);
    this.updateChart('school-attendance', this.schoolChartData); 
  }

  updateCityChartData() {
    this.cityChartData = this.dash.updateCityBarChart(this.cities); 
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
  }

  changeEndDate($event) {
    console.log((<HTMLTextAreaElement>event.target).value);
  }
}
