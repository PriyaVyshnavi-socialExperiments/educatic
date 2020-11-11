import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignmentUploadPage } from './assignment-upload.page';

const routes: Routes = [
  {
    path: '',
    component: AssignmentUploadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignmentUploadPageRoutingModule {}
