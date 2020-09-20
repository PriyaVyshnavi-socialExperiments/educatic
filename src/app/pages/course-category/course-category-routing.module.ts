import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseCategoryPage } from './course-category.page';

const routes: Routes = [
  {
    path: '',
    component: CourseCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseCategoryPageRoutingModule {}
