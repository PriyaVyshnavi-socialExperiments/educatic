import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { IonicModule } from '@ionic/angular';

import { OfflineWebsitesPageRoutingModule } from './offline-websites-routing.module';

import { OfflineWebsitesPage } from './offline-websites.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfflineWebsitesPageRoutingModule,
    NgxExtendedPdfViewerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [InAppBrowser, DocumentViewer, FileOpener],
  declarations: [OfflineWebsitesPage]
})
export class OfflineWebsitesPageModule {}
