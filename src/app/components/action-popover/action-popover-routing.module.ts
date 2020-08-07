import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActionPopoverPage } from './action-popover.page';

const routes: Routes = [
  {
    path: '',
    component: ActionPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionPopoverPageRoutingModule {}
