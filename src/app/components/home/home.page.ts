import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services';
import { isMobileDevice } from '../../_helpers';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Role } from 'src/app/_models';
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
    public popoverController: PopoverController,
    private router: Router
  ) { }

  public ngOnInit() {
    this.isLoggedIn = this.authenticationService.currentUser ? true : false;
    this.isMobileDevice = isMobileDevice;
    this.authenticationService.currentUser.subscribe((user) => {
      this.currentUser = user;
      this.RedirectToRoleSpecificURL(user.role)
    });
  }

  private RedirectToRoleSpecificURL(userRole) {
    switch (userRole) {
      case Role.SuperAdmin:
        this.router.navigate(['/schools']);
        break;
      case Role.SchoolSuperAdmin:
        this.router.navigate(['/teachers']);
        break;
      case Role.Teacher:
        this.router.navigate(['/student']);
        break;
      default:
        break;
    }
  }
}