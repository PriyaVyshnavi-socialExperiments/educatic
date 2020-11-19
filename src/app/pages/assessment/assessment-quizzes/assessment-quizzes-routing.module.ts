import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssessmentQuizzesPage } from './assessment-quizzes.page';

const routes: Routes = [
  {
    path: '',
    component: AssessmentQuizzesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssessmentQuizzesPageRoutingModule {}
