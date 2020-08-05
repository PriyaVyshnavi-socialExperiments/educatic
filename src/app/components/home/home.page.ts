import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services';
import { isMobileDevice } from '../../_helpers';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isLoggedIn = false;
  isMobileDevice: any;
  currentUser: any;
  constructor(
    private authenticationService: AuthenticationService,
    public popoverController: PopoverController
  ) { }

  public ngOnInit() {
    this.isLoggedIn = this.authenticationService.currentUser ? true : false;
    this.isMobileDevice = isMobileDevice;
    this.authenticationService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }
}
