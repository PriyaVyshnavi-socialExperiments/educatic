import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssessmentQuestionsPage } from './assessment-questions.page';

const routes: Routes = [
  {
    path: '',
    component: AssessmentQuestionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssessmentQuestionsPageRoutingModule {}
