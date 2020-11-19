import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ICourseContentCategory } from 'src/app/_models/course-content-category';

@Component({
  selector: 'app-assessment-quiz-add',
  templateUrl: './assessment-quiz-add.page.html',
  styleUrls: ['./assessment-quiz-add.page.scss'],
})
export class AssessmentQuizAddPage implements OnInit {
  @ViewChild('documentEditForm') documentEditForm: FormGroupDirective;
  
  courseCategory: ICourseContentCategory[] = [];
  quizForm: FormGroup;

  constructor(private formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.quizForm = this.formBuilder.group({
      quizTitle: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      quizDescription: new FormControl('', [
        Validators.required,
        Validators.maxLength(1000),
      ]),
      quizCategory: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  SubmitQuiz(){

  }

  onChangeCategory(){

  }

  AddNewCategory(){

  }

}
