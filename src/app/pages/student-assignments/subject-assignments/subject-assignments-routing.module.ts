import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubjectAssignmentsPage } from './subject-assignments.page';

const routes: Routes = [
  {
    path: '',
    component: SubjectAssignmentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubjectAssignmentsPageRoutingModule {}
