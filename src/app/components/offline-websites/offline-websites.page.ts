import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
// import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Plugins, registerWebPlugin } from '@capacitor/core';
import { Platform } from '@ionic/angular';

const { FileOpener } = Plugins;

@Component({
  selector: 'app-offline-websites',
  templateUrl: './offline-websites.page.html',
  styleUrls: ['./offline-websites.page.scss'],
})
export class OfflineWebsitesPage implements OnInit {

  public showPDF = false;
  constructor(private iab: InAppBrowser, private document: DocumentViewer, private platform: Platform) {
  }

  initializeApp() {
}

  ngOnInit() {

  }

  openWebContent() {
    const browser = this.iab.create('../../../assets/offline-content/en-math_expression/index.html');
    browser.show();
  }

}
