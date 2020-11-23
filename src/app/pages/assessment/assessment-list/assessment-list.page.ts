import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.page.html',
  styleUrls: ['./assessment-list.page.scss'],
})
export class AssessmentListPage implements OnInit {

  constructor( private router: Router,) { }

  ngOnInit() {
  }

  AddNewCategory() {

  }

  AddNewQuiz() {
    this.router.navigate(['/assessment/quiz/add']);
  }

  NavigateToQuestions() {
    this.router.navigate(['/assessment/questions']);
  }

}
