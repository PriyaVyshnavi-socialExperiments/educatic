import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subject-assignments',
  templateUrl: './subject-assignments.page.html',
  styleUrls: ['./subject-assignments.page.scss'],
})
export class SubjectAssignmentsPage implements OnInit {

  constructor(public router: Router,) { }

  ngOnInit() {
  }

  public selectAssignment() {
    this.router.navigateByUrl(`/assignment/lesson`);
  }

}
