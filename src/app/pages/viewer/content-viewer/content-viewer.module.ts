import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';


import { IonicModule } from '@ionic/angular';

import { ContentViewerPageRoutingModule } from './content-viewer-routing.module';

import { ContentViewerPage } from './content-viewer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContentViewerPageRoutingModule,
    NgxExtendedPdfViewerModule
  ],
  declarations: [ContentViewerPage]
})
export class ContentViewerPageModule {}
