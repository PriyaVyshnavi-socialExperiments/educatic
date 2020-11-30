import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assessment-question-add',
  templateUrl: './assessment-question-add.page.html',
  styleUrls: ['./assessment-question-add.page.scss'],
})
export class AssessmentQuestionAddPage implements OnInit {

  questionForm: FormGroup;
  answerIndex = false;
  constructor(private formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.questionForm = this.formBuilder.group({
      question: new FormControl(`22 students out of 50 from Class 2 (Section A) are selected for a quiz. 27 students out of 50 students from Class 2 (Section B) are selected for the same quiz. How many total number of students are selected from section A and B for the quiz?`, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      questionType: new FormControl(``, [
        Validators.required,
      ]),
      answerOptions: new FormArray([])
    });
  }

  get f() {
    return this.questionForm.controls
  }

  get t() { return this.f.answerOptions as FormArray; }

  SubmitQuestion() {

  }

  selectedAnswerOption(event) {
    console.log('selectedAnswerOption ', event.target.value);
  }

  checkEvent($event) {
    console.log('$event: ', $event);
  }

  onChangeQuestionType(questionType) {
    this.t.clear();
    switch (questionType.value) {
      case 'multiplechoice':
        for (let i = this.t.length; i < 4; i++) {
          this.t.push(this.formBuilder.group({
            answerOption: [`${48 - i}`, Validators.required]
          }));
        }
        break;
      case 'truefalse':
        this.t.push(this.formBuilder.group({
          answerOption: [{value: `True`, disabled: true}, Validators.required]
        }));
        this.t.push(this.formBuilder.group({
          answerOption: [{value: `False`, disabled: true}, Validators.required]
        }));
        break;
      default:
        break;
    }

  }

}
