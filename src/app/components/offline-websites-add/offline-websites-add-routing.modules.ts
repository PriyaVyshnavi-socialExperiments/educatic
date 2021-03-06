import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { OfflineWebsitesAddPage } from './offline-websites-add.page';

const routes: Routes = [
  {
    path: '',
    component: OfflineWebsitesAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfflineWebsitesAddPageRoutingModule {}
