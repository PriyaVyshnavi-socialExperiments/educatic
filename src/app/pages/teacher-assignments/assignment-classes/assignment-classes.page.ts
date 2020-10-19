import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assignment-classes',
  templateUrl: './assignment-classes.page.html',
  styleUrls: ['./assignment-classes.page.scss'],
})
export class AssignmentClassesPage implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  public selectSubject() {
    this.router.navigateByUrl(`teacher/assignment/subjects`);
  }

}
