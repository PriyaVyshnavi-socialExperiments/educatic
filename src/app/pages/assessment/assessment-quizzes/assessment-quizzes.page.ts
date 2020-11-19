import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assessment-quizzes',
  templateUrl: './assessment-quizzes.page.html',
  styleUrls: ['./assessment-quizzes.page.scss'],
})
export class AssessmentQuizzesPage implements OnInit {

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
