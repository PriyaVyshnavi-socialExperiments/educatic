import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeacherAddPage } from './teacher-add.page';

const routes: Routes = [
  {
    path: '',
    component: TeacherAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherAddPageRoutingModule {}
