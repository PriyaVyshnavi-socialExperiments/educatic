import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assignment-students',
  templateUrl: './assignment-students.page.html',
  styleUrls: ['./assignment-students.page.scss'],
})
export class AssignmentStudentsPage implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  public selectStudent() {
    this.router.navigateByUrl(`teacher/assignment/student/list`);
  }

}
