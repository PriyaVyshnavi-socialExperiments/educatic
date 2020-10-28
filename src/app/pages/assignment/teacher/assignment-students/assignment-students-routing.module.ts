import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignmentStudentsPage } from './assignment-students.page';

const routes: Routes = [
  {
    path: '',
    component: AssignmentStudentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignmentStudentsPageRoutingModule {}
