import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssessmentCategoryPage } from './assessment-category.page';

const routes: Routes = [
  {
    path: '',
    component: AssessmentCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssessmentCategoryPageRoutingModule {}
