import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignmentViewPage } from './assignment-view.page';

const routes: Routes = [
  {
    path: '',
    component: AssignmentViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignmentViewPageRoutingModule {}
