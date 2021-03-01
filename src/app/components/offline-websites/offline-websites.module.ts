import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { IonicModule } from '@ionic/angular';

import { OfflineWebsitesPageRoutingModule } from './offline-websites-routing.module';
import { OfflineWebsitesPage } from './offline-websites.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfflineWebsitesPageRoutingModule,
    NgxExtendedPdfViewerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [InAppBrowser, DocumentViewer],
  declarations: [OfflineWebsitesPage]
})
export class OfflineWebsitesPageModule {}
