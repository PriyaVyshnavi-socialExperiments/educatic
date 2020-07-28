import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { isMobileDevice } from './_helpers';
import { ApplicationInsightsService } from './_helpers/application-insights';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit {
  navigate : any;
  isMobileDevice: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private appInsightService: ApplicationInsightsService
  ) {
    this.initializeApp();
  }
  ngOnInit(): void {
    this.appInsightService.logEvent('Application Loaded.');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.isMobileDevice = isMobileDevice;
      console.log('isMobileDevice: ', isMobileDevice);
    });
  }
}
