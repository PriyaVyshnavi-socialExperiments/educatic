import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAnswer, IAssessment, IQuestion } from 'src/app/_models/assessment';
import { QuestionType } from 'src/app/_models/question-type';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.page.html',
  styleUrls: ['./assessment.page.scss'],
})
export class AssessmentPage implements OnInit {
  title: string;
  assessment: IAssessment;
  assessmentAnswers: IAnswer[] = [];
  options = [1, 2, 3, 4];
  visibleQuestion = 0;
  questionCount = 0;
  isNext = false;
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

  validateAnswerColor(selectedOption, option, question: IQuestion) {
    selectedOption = selectedOption?.value?.option;
    return selectedOption === option && selectedOption === question.optionAnswer + 1 ? 'success' : '';
  }

  shortAnswerText(shortAnswer) {
    shortAnswer = shortAnswer.value.trim();
    if (shortAnswer?.length) {
      this.isNext = true;
    } else {
      this.isNext = false;
    }
  }

  selectedAnswerOption(selectedOption) {
    selectedOption = selectedOption.value;
    if (selectedOption.option) {
      const optionQuestion: { option: number, question: IQuestion } = selectedOption;
      if (optionQuestion.option === optionQuestion.question.optionAnswer + 1) {
        this.isNext = true;
      } else {
        this.isNext = false;
      }
    }
  }

  updateAssessmentAnswers() {
  }
}
