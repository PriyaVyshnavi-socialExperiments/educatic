import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssessmentQuizAddPage } from './assessment-quiz-add.page';

const routes: Routes = [
  {
    path: '',
    component: AssessmentQuizAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssessmentQuizAddPageRoutingModule {}
