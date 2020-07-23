import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { isMobileDevice } from './_helpers';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {
  navigate : any;
  isMobileDevice: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    this.navigate =
    [
      {
        title : 'Home',
        url   : '/home',
        icon  : 'home'
      },
      {
        title : 'Chat',
        url   : '/chat',
        icon  : 'chatboxes'
      },
      {
        title : 'Contacts',
        url   : '/contacts',
        icon  : 'contacts'
      },
    ];
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
