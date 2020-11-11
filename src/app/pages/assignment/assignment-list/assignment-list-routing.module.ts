import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignmentListPage } from './assignment-list.page';

const routes: Routes = [
  {
    path: '',
    component: AssignmentListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignmentListPageRoutingModule {}
