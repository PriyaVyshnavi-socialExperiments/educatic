import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadAssignmentPage } from './upload-assignment.page';

const routes: Routes = [
  {
    path: '',
    component: UploadAssignmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadAssignmentPageRoutingModule {}
