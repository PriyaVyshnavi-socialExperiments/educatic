import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAssessment } from 'src/app/_models/assessment';
import { QuestionType } from 'src/app/_models/question-type';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.page.html',
  styleUrls: ['./assessment.page.scss'],
})
export class AssessmentPage implements OnInit {
  title: string;
  assessment: IAssessment;
  options = [1,2,3,4];
  constructor( private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.title = this.activatedRoute.snapshot.paramMap.get('subject');
    this.assessment = history.state.assessment as IAssessment;
  }

}
