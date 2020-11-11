import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ClassRoomService } from '../../../_services/class-room/class-room.service';
import { element } from 'protractor';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @Input() selected;
  @Output() selectedChange = new EventEmitter<number>();
  school;
  class;
  schools;
  classes;

  constructor(public sql: ClassRoomService) { }

  async ngOnInit() {
    this.school = this.selected.selectedSchools;
    this.class = this.selected.selectedClasses;
    this.schools = this.selected.allSchools;
    this.classes = this.selected.allClasses;
  }

  changeClass() {
    if (this.selected && this.class) {
      this.selected.selectedClasses = this.class;
      this.selectedChange.emit(this.selected);
    }
  }

  changeSchool() {
    if (this.selected && this.school) {
      this.selected.selectedSchools = this.school;
      this.selected.allClasses = [];
      this.selected.maps.points = [];
      this.selected.maps.lat = null
      this.selected.maps.long = null;
      this.selected.selectedSchools.forEach((school) => {
        this.selected.allClasses = this.selected.allClasses.concat(school.classList);
        this.selected.maps.points.push({
          lat: school.lat, 
          long: school.long
        });
      })
      if (this.school.length > 0) {
        this.selected.maps.lat = this.school[0].lat;
        this.selected.maps.long = this.school[0].long;  
      }
      this.classes = this.selected.allClasses;
      if (this.class.length === 0) {
        this.schoolAttendence();
      } else {
        this.selectedChange.emit(this.selected);
      }
    }
  }

  schoolAttendence() {
    this.selectedChange.emit(this.selected);
  }
}
