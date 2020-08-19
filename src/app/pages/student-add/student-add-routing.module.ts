import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentAddPage } from './student-add.page';

const routes: Routes = [
  {
    path: '',
    component: StudentAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentAddPageRoutingModule {}
