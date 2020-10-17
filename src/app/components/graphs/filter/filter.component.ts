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
    this.school = this.selected.school;
    this.class = this.selected.class;
    this.schools = this.selected.schools;
    this.classes = this.selected.classes;
  }

  changeClass() {
    if (this.selected && this.class) {
      this.selected.class = this.class;
      this.selectedChange.emit(this.selected);
    }
  }

  changeSchool() {
    if (this.selected && this.school) {
      this.selected.school = this.school;
      this.selected.classes = this.school.classList;
      this.classes = this.selected.classes;
      this.selected.maps.lat = this.school.lat;
      this.selected.maps.long = this.school.long;
      this.selectedChange.emit(this.selected);
    }
  }
}
