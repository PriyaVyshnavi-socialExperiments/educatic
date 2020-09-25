import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoViewerPage } from './video-viewer.page';

const routes: Routes = [
  {
    path: '',
    component: VideoViewerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoViewerPageRoutingModule {}
