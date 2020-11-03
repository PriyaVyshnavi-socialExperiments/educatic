import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseSharePage } from './course-share.page';

const routes: Routes = [
  {
    path: '',
    component: CourseSharePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseSharePageRoutingModule {}
