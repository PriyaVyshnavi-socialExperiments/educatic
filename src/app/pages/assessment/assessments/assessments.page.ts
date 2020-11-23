import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.page.html',
  styleUrls: ['./assessments.page.scss'],
})
export class AssessmentsPage implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }

  selectAssessment(subject: string) {
    this.router.navigate([`assessment/${subject}/1000/student`]);
  }

}
