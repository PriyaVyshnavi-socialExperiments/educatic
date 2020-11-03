import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignmentClassesPage } from './assignment-classes.page';

const routes: Routes = [
  {
    path: '',
    component: AssignmentClassesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignmentClassesPageRoutingModule {}
