import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssessmentSharePage } from './assessment-share.page';

const routes: Routes = [
  {
    path: '',
    component: AssessmentSharePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssessmentSharePageRoutingModule {}
