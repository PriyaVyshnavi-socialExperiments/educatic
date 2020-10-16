import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { Platform } from '@ionic/angular';
import { IOfflineWebsite } from 'src/app/_models/offline-website';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-offline-websites',
  templateUrl: './offline-websites.page.html',
  styleUrls: ['./offline-websites.page.scss'],
})
export class OfflineWebsitesPage implements OnInit {

  offlineWebsites: IOfflineWebsite[] = [];

  public showPDF = false;
  constructor(private iab: InAppBrowser, private document: DocumentViewer, private platform: Platform) {
  }

  initializeApp() {
  }

  ngOnInit() {

    this.offlineWebsites = [{ id: 1, title: 'Educate', description: 'Developing Young Leaders & Entrepreneurs in Africa www.experienceeducate.org with Leadership & Entrepeneurship Course', url: 'en-educate' },
    {
      id: 2, title: 'Math Expression', description: `Having difficulty understanding math? Looking for help in math? 
    Or a free math tutor? If yes, MathExpression.com is for you! Here, 
    we provide free math tutoring online. To do so, we have carefully created easy and understandable lessons for you.`,
      url: 'en-math'
    },
    {
      id: 3, title: 'OLPC Educational Packages', description: `A collection of educational materials consolidated by the OLPC project.`
      , url: 'en-olpc'
    }]

  }

  openWebContent(webURL: string) {
    const browser = this.iab.create(`${environment.offlineWebsiteURL}/${webURL}/index.html`);
    browser.show();
  }

}
