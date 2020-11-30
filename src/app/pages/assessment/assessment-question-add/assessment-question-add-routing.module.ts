import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssessmentQuestionAddPage } from './assessment-question-add.page';

const routes: Routes = [
  {
    path: '',
    component: AssessmentQuestionAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssessmentQuestionAddPageRoutingModule {}
