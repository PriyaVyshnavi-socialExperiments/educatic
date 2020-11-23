import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastUiImageEditorModule } from 'ngx-tui-image-editor';

import { IonicModule } from '@ionic/angular';

import { ImageEditViewerPageRoutingModule } from './image-edit-viewer-routing.module';

import { ImageEditViewerPage } from './image-edit-viewer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ToastUiImageEditorModule,
    ImageEditViewerPageRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ImageEditViewerPage]
})
export class ImageEditViewerPageModule {}
