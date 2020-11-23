import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssessmentQuestionsPageRoutingModule } from './assessment-questions-routing.module';

import { AssessmentQuestionsPage } from './assessment-questions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssessmentQuestionsPageRoutingModule
  ],
  declarations: [AssessmentQuestionsPage]
})
export class AssessmentQuestionsPageModule {}
