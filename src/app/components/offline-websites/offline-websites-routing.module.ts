import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfflineWebsitesPage } from './offline-websites.page';

const routes: Routes = [
  {
    path: '',
    component: OfflineWebsitesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfflineWebsitesPageRoutingModule {}
