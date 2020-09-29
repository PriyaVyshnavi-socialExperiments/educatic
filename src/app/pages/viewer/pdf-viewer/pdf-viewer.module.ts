import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { IonicModule } from '@ionic/angular';

import { PdfViewerPageRoutingModule } from './pdf-viewer-routing.module';
import { PdfViewerPage } from './pdf-viewer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfViewerPageRoutingModule,
    NgxExtendedPdfViewerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [PdfViewerPage]
})
export class PdfViewerPageModule { }
