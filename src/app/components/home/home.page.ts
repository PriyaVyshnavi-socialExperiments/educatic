import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services';
import { isMobileDevice } from '../../_helpers';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../../components/popover/popover.component';
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
  ngOnInit() {
    this.isLoggedIn = this.authenticationService.currentUser? true : false;
    this.isMobileDevice = isMobileDevice;
    this.authenticationService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  public async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      mode:'ios'
    });
    return await popover.present();
  }
}
