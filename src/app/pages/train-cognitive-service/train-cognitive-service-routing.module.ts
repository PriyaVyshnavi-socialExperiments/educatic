import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainCognitiveServicePage } from './train-cognitive-service.page';

const routes: Routes = [
  {
    path: '',
    component: TrainCognitiveServicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainCognitiveServicePageRoutingModule {}
