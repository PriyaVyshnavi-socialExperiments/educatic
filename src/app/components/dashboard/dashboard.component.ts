import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../graphs/modal/modal.page';
import { DashboardService } from '../../_services/dashboard/dashboard.service';
import { ChartsComponent } from '../graphs/charts/charts.component';
import { Chart } from 'chart.js';
import { BarChartComponent } from '../graphs/bar-chart/bar-chart.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit { 
  @ViewChild(ChartsComponent) chartComponent : ChartsComponent;
  @ViewChild(BarChartComponent) barChartComponent : BarChartComponent;
  data;
  cities = [];
  schools = [];
  classes = [];
  allCities = []; 
  allSchools = [];
  allClasses = [];

  classChartData = [];
  schoolChartData = {
    labels: [],
    data: []
  };
  cityChartData = {
    labels: [],
    data: []
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
      this.data = this.dash.processData(result[0], result[1], result[2], result[3]);
      console.log(this.data);
      for (let city of this.data.cities.keys()) {
        this.cities.push(city); 
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
        for (let school of this.data.cities.get(city).schools) {
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
        if (school && this.data.schools.get(school.id).classes) {
          for (let classRoom of this.data.schools.get(school.id).classes) {
            this.allClasses.push(classRoom);
          }
        }
      });
    }
    this.updateSchoolChartData();
  }

  changeClasses() {
    this.classChartData = [];
    if (this.classes) {
      for (let entry of this.classes) {
        if (this.data.classes.get(entry.classId).attendance.size > 0) {
          let entryData = [];
          for (let dateEntry of this.data.classes.get(entry.classId).attendance.keys()) {
            let total: number = this.data.classes.get(entry.classId).attendance.get(dateEntry).total;
            let present: number = this.data.classes.get(entry.classId).attendance.get(dateEntry).present;
            let attendance = (present / total) * 100;
            let data = {
              x: new Date(dateEntry),
              y: attendance
            }
            entryData.push(data);
          }
          let graphDataEntry = {
            title: entry.classRoomName, 
            data: entryData
          }
          this.classChartData.push(graphDataEntry);
        }
      }
    }
  }

  updateSchoolChartData() {
    this.schoolChartData.data = [];
    this.schoolChartData.labels = [];
    for (let entry of this.schools) {
      if (this.data.schools.get(entry.id).attendance.size > 0) {
        let total = 0;
        let present = 0;
        for (let dateEntry of this.data.schools.get(entry.id).attendance.keys()) {
          total += this.data.schools.get(entry.id).attendance.get(dateEntry).total;
          present += this.data.schools.get(entry.id).attendance.get(dateEntry).present;        
        }
        let attendance = present/total * 100;
        this.schoolChartData.data.push(attendance);
        this.schoolChartData.labels.push(entry.name);
      }
      
    }
  }

  updateCityChartData() {
    this.cityChartData.data = [];
    this.cityChartData.labels = [];
    for (let entry of this.cities) {
      let total = 0;
      let present = 0;
      for (let dateEntry of this.data.cities.get(entry).attendance.keys()) {
        total += this.data.cities.get(entry).attendance.get(dateEntry).total;
        present += this.data.cities.get(entry).attendance.get(dateEntry).present;
      }
      let attendance = present / total * 100;
      this.cityChartData.data.push(attendance);
      this.cityChartData.labels.push(entry); 
    }
  }

  changeStartDate($event) {
    console.log((<HTMLTextAreaElement>event.target).value);
  }

  changeEndDate($event) {
    console.log((<HTMLTextAreaElement>event.target).value);
  }
}
