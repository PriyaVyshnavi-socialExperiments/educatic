import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assignment-subjects',
  templateUrl: './assignment-subjects.page.html',
  styleUrls: ['./assignment-subjects.page.scss'],
})
export class AssignmentSubjectsPage implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  public selectSubject() {
    this.router.navigateByUrl(`teacher/assignment/student/list`);
  }

}
