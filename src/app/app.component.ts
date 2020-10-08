import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { isMobileDevice } from './_helpers';
import { ApplicationInsightsService } from './_helpers/application-insights';
import { SqliteStorageService } from './_services/sqlite-storage/sqlite.storage.service';
import { NetworkService } from './_services/network/network.service';
import { OfflineSyncManagerService } from './_services/offline-sync-manager/offline-sync-manager.service';
import { RefreshServerService } from './_services/refresh-server/refresh-server.service';
import { ServiceEvent } from './_models/service-event';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit {
  navigate: any;
  isMobileDevice: any;
  filteredUrlPatterns = ['azure/students'];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private appInsightService: ApplicationInsightsService,
    private sqlStorageService: SqliteStorageService,
    private networkService: NetworkService,
    private offlineSyncManager: OfflineSyncManagerService,
    private refreshServer: RefreshServerService,
  ) {
    this.initializeApp();
  }
  ngOnInit(): void {
    this.appInsightService.logEvent('Application Loaded.');
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

      /** Monitor the network status and send offline data to API when connection is restored */
      this.networkService.online.subscribe((status) => {
        if (status) {
          this.offlineSyncManager.CheckForEvents().subscribe();
        }
      });

      this.refreshServer.onChange.subscribe({
        next: (event: ServiceEvent) => {
          console.log(`Received message #${event.eventId}: ${event.message}`);
        }
      });

    });
  }
}
