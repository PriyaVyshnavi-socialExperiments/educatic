import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssessmentQuestionAddPageRoutingModule } from './assessment-question-add-routing.module';

import { AssessmentQuestionAddPage } from './assessment-question-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssessmentQuestionAddPageRoutingModule
  ],
  declarations: [AssessmentQuestionAddPage]
})
export class AssessmentQuestionAddPageModule {}
