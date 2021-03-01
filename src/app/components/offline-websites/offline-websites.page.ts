import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { Platform } from '@ionic/angular';
import { IOfflineWebsite } from 'src/app/_models/offline-website';
import { environment } from 'src/environments/environment';
import { OfflineWebsiteService } from '../../_services/offline-websites/offline-websites.service';
import { dateFormat } from 'src/app/_helpers';
import * as blobUtil from 'blob-util';
import { ContentHelper } from 'src/app/_helpers/content-helper';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { finalize, takeWhile } from 'rxjs/operators';
import { pipe } from 'rxjs'; 

@Component({
  selector: 'app-offline-websites',
  templateUrl: './offline-websites.page.html',
  styleUrls: ['./offline-websites.page.scss'],
})
export class OfflineWebsitesPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  // Need to populate array with Offline websites from azure
  offlineWebsites: IOfflineWebsite[] = [];

  public showPDF = false;
  constructor(
    private iab: InAppBrowser, 
    private document: DocumentViewer, 
    private platform: Platform,
    private offflineWebsiteUpload: OfflineWebsiteService,
    private spinner: SpinnerVisibilityService,
    private toastController: ToastController,
    ) {  }

  initializeApp() {
  }

  ngOnInit() {
    this.refresh(); 
  //   this.offlineWebsites = [{ id: 1, title: 'Educate', description: 'Developing Young Leaders & Entrepreneurs in Africa www.experienceeducate.org with Leadership & Entrepeneurship Course', 
  //   url: 'en-educate',
  //   img: 'assets/images/educate.jpg'
  // },
  //   {
  //     id: 2, title: 'Math Expression', description: `Having difficulty understanding math? Looking for help in math? 
  //   Or a free math tutor? If yes, MathExpression.com is for you! Here, 
  //   we provide free math tutoring online. To do so, we have carefully created easy and understandable lessons for you.`,
  //     url: 'test',
  //     img: 'assets/images/en-math.jpg'
  //   },
  //   {
  //     id: 3, title: 'OLPC Educational Packages', description: `A collection of educational materials consolidated by the OLPC project.`
  //     , url: 'en-olpc',
  //     img: 'assets/images/en-olpc.jpg'
  //   }]

  }

  private refresh() {
    this.offflineWebsiteUpload.getWebsiteNames().subscribe((res) => {
      this.offlineWebsites = []; 
      let i;
      if (res && res.length > 0) {
        res.forEach((website) => {
          this.offlineWebsites.push({
            id: i++,
            title: website.name.slice(0, -1),
            description: "",
            url: website.name.slice(0, -1),
            img: ""
          })
        })
      }
    });
  }
  
  UploadOffLineWebsiteFile(event: EventTarget) {
    this.spinner.show();
    const eventObj: MSInputMethodContext = event as MSInputMethodContext;
    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    const files: FileList = target.files;
    if (files.length <= 0) {
      this.spinner.hide();
      return; 
    }
    this.offflineWebsiteUpload.SubmitCourseContent(files).pipe(
      takeWhile((res) => { 
        return res[res.length - 1]["progress"] != 100;
      }),
      finalize(()=> {
        this.spinner.hide();
        this.presentToast("Finished Uploading", 'success');
        this.fileInput.nativeElement.value = '';
        this.refresh(); 
      })
    )
    .subscribe(
      (res) =>  {  },
      (err) =>  { this.presentToast("Upload Failed", "warning") },
    );
  }


  openWebContent(webURL: string) {
    const browser = this.iab.create(`${environment.offlineWebsiteURL}/${webURL}/index.html`);
    browser.show();
  }

  private async presentToast(msg, type) {
    this.spinner.hide();
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 3000,
      color: type,
      buttons: [{
        text: 'Close',
        role: 'cancel',
      }
      ]
    });
    toast.present();
  }

}
