import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { Platform } from '@ionic/angular';
import { IOfflineWebsite } from 'src/app/_models/offline-website';
import { environment } from 'src/environments/environment';
import { OfflineWebsiteService } from '../../_services/offline-websites/offline-websites.service';
import { dateFormat } from 'src/app/_helpers';
import * as blobUtil from 'blob-util';
import { ContentHelper } from 'src/app/_helpers/content-helper';



@Component({
  selector: 'app-offline-websites',
  templateUrl: './offline-websites.page.html',
  styleUrls: ['./offline-websites.page.scss'],
})
export class OfflineWebsitesPage implements OnInit {


  // Need to populate array with Offline websites from azure
  offlineWebsites: IOfflineWebsite[] = [];

  public showPDF = false;
  constructor(private iab: InAppBrowser, private document: DocumentViewer, private platform: Platform,
    private offflineWebsiteUpload: OfflineWebsiteService) {
  }

  initializeApp() {
  }

  ngOnInit() {

    this.offlineWebsites = [{ id: 1, title: 'Educate', description: 'Developing Young Leaders & Entrepreneurs in Africa www.experienceeducate.org with Leadership & Entrepeneurship Course', 
    url: 'en-educate',
    img: 'assets/images/educate.jpg'
  },
    {
      id: 2, title: 'Math Expression', description: `Having difficulty understanding math? Looking for help in math? 
    Or a free math tutor? If yes, MathExpression.com is for you! Here, 
    we provide free math tutoring online. To do so, we have carefully created easy and understandable lessons for you.`,
      url: 'test',
      img: 'assets/images/en-math.jpg'
    },
    {
      id: 3, title: 'OLPC Educational Packages', description: `A collection of educational materials consolidated by the OLPC project.`
      , url: 'en-olpc',
      img: 'assets/images/en-olpc.jpg'
    }]

  }
  
  UploadOffLineWebsiteFile(event: EventTarget) {
    const eventObj: MSInputMethodContext = event as MSInputMethodContext;
    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    const files: FileList = target.files;
    console.log(files);
    this.offflineWebsiteUpload.SubmitCourseContent(files).subscribe((res) => {
      console.log(res); 
    });
    // let blobDataURL = file.name;
    // file.arrayBuffer().then((buffer) => {
    //   const blobData = blobUtil.arrayBufferToBlob(buffer);
    //   const fileData = ContentHelper.blobToFile(blobData, blobDataURL);
    //   console.log(fileData);
    //   this.offflineWebsiteUpload.SubmitCourseContent(fileData);
    // });
  }


  openWebContent(webURL: string) {
    const browser = this.iab.create(`${environment.offlineWebsiteURL}/${webURL}/index.html`);
    browser.show();
  }

}
