import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignmentSubjectsPage } from './assignment-subjects.page';

const routes: Routes = [
  {
    path: '',
    component: AssignmentSubjectsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignmentSubjectsPageRoutingModule {}
