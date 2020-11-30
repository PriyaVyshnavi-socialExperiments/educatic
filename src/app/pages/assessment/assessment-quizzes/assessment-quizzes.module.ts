import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssessmentQuizzesPageRoutingModule } from './assessment-quizzes-routing.module';

import { AssessmentQuizzesPage } from './assessment-quizzes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssessmentQuizzesPageRoutingModule
  ],
  declarations: [AssessmentQuizzesPage]
})
export class AssessmentQuizzesPageModule {}
