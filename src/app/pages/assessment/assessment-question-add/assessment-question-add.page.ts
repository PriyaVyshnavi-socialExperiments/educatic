import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IUser } from 'src/app/_models';
import { IAssessment, IQuestion } from 'src/app/_models/assessment';
import { QuestionType } from 'src/app/_models/question-type';
import { AuthenticationService } from 'src/app/_services';
import { AssessmentService } from 'src/app/_services/assessment/assessment.service';

@Component({
  selector: 'app-assessment-question-add',
  templateUrl: './assessment-question-add.page.html',
  styleUrls: ['./assessment-question-add.page.scss'],
})
export class AssessmentQuestionAddPage implements OnInit {

  questionForm: FormGroup;
  answerIndex = false;
  currentUser: IUser; 
  quizAssessment: IAssessment;  
  
  constructor(private formBuilder: FormBuilder,
    private assessmentService: AssessmentService,
    private authenticationService: AuthenticationService,
    public router: Router,
    private toastController: ToastController) { }

  ngOnInit() {
    this.quizAssessment = history.state.assessment as IAssessment;

    this.questionForm = this.formBuilder.group({
      question: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      questionType: new FormControl(``, [
        Validators.required,
      ]),
      answerOptions: new FormArray([])
    });

    this.authenticationService.currentUser?.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
    });
  }

  get f() {
    return this.questionForm.controls
  }

  get t() { return this.f.answerOptions as FormArray; }

  SubmitQuestion() {

    if (this.questionForm.invalid) {
      return;
    } else {
      const question = {
       questionDescription: this.f.question.value,
       questionType: this.f.questionType.value
      } as IQuestion;

      const option = {};
      option[1] = this.t.value[0].answerOption;
      option[2] = this.t.value[1].answerOption;
      option[3] = this.t.value[2].answerOption;
      option[4] = this.t.value[3].answerOption;
      question.questionOptions = option;

      this.assessmentService.CreateUpdateAssessmentQuestion(question, this.quizAssessment.id).subscribe((res) => {
        this.router.navigateByUrl(`/assessment/quizzes`);
      });
    }

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
      case QuestionType.Objective:
        for (let i = this.t.length; i < 4; i++) {
          this.t.push(this.formBuilder.group({
            answerOption: [`${48 - i}`, Validators.required]
          }));
        }
        break;
      case QuestionType.TrueFalse:
        this.t.push(this.formBuilder.group({
          answerOption: [{ value: `True`, disabled: true }, Validators.required]
        }));
        this.t.push(this.formBuilder.group({
          answerOption: [{ value: `False`, disabled: true }, Validators.required]
        }));
        break;
      case QuestionType.ShortAnswer:
        break;
      default:
        break;
    }

  }

}
