import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { isMobileDevice } from './_helpers';
import { ApplicationInsightsService } from './_helpers/application-insights';
import { SqliteStorageService } from './_services/sqlite.storage.service';
import { NetworkService } from './_services/network.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit {
  navigate: any;
  isMobileDevice: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private appInsightService: ApplicationInsightsService,
    private sqlStorageService: SqliteStorageService,
    private networkService: NetworkService
  ) {
    this.initializeApp();
  }
  ngOnInit(): void {
    this.appInsightService.logEvent('Application Loaded.');

      /** Monitor the network status and send offline data to API when connection is restored */
      this.networkService.online.subscribe( ( status ) => {
        if ( !status ) {
           console.log('Offline Network');
        }
    } );
  }

  async ngAfterViewInit() {
    // Initialize the CapacitorDataStorageSQLite plugin
    await this.sqlStorageService.init();
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
