import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssessmentAddPage } from './assessment-add.page';

const routes: Routes = [
  {
    path: '',
    component: AssessmentAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssessmentAddPageRoutingModule {}
