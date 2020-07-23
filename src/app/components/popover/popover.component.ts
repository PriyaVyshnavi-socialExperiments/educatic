import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  currentUser: any;
  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  async logout() {
    await this.popoverController.dismiss();
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
