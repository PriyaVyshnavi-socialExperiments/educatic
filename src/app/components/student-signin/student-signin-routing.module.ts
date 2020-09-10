import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentSigninPage } from './student-signin.page';

const routes: Routes = [
  {
    path: '',
    component: StudentSigninPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentSigninPageRoutingModule {}
