import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssessmentSolvedPage } from './assessment-solved.page';

const routes: Routes = [
  {
    path: '',
    component: AssessmentSolvedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssessmentSolvedPageRoutingModule {}
