import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAssessment, IQuestion } from 'src/app/_models/assessment';
import { QuestionType } from 'src/app/_models/question-type';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.page.html',
  styleUrls: ['./assessment.page.scss'],
})
export class AssessmentPage implements OnInit {
  title: string;
  assessment: IAssessment;
  options = [1, 2, 3, 4];
  visibleQuestion = 0;
  questionCount = 0;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.title = this.activatedRoute.snapshot.paramMap.get('subject');
    this.assessment = history.state.assessment as IAssessment;
    this.questionCount = this.assessment.assessmentQuestions.length - 1;
    if (!this.assessment) {
      this.router.navigateByUrl(`assessment/quizzes/${this.title}`);
    }
  }

  visibleNext(question: IQuestion, index: number) {
    return true;
  }

  selectedAnswerOption(event) {
    console.log('selectedAnswerOption ', event.target.value);
  }

}
