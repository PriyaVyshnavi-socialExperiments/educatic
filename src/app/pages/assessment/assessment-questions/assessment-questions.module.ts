import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssessmentQuestionsPageRoutingModule } from './assessment-questions-routing.module';

import { AssessmentQuestionsPage } from './assessment-questions.page';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatSelectModule ,
    AssessmentQuestionsPageRoutingModule
  ],
  declarations: [AssessmentQuestionsPage]
})
export class AssessmentQuestionsPageModule {}
