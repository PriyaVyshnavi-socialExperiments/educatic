import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageEditViewerPage } from './image-edit-viewer.page';

const routes: Routes = [
  {
    path: '',
    component: ImageEditViewerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageEditViewerPageRoutingModule {}
