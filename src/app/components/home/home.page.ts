import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../_services';
import { isMobileDevice } from '../../_helpers';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Role } from 'src/app/_models';
import { IPowerBIConfig } from 'src/app/_models/power-bi-config';
import { SchoolService } from 'src/app/_services/school/school.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  isLoggedIn = false;
  isMobileDevice: any;
  currentUser: any;
  powerBIConfig: any;
  constructor(
    private authenticationService: AuthenticationService,
    private schoolService: SchoolService,
    public popoverController: PopoverController,
    private router: Router
  ) { }
  ngOnDestroy(): void {
  }

  public ngOnInit() {
    this.isLoggedIn = this.authenticationService.currentUser ? true : false;
    this.isMobileDevice = isMobileDevice;
    this.authenticationService.currentUser.subscribe((user) => {
      this.currentUser = user;
     // this.RedirectToRoleSpecificURL(user.role)
    });
    this.refreshDashboard();
  }

  refreshDashboard(){
    this.schoolService.GetPowerBIConfig().subscribe((config) => {
      this.powerBIConfig = config[0];
      this.powerBIConfig.embedUrl = this.powerBIConfig.embedUrl + '&isMobile=true';
    })
  }

  onEmbedded(data) {

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
        this.router.navigate(['/students']);
        break;
      default:
        break;
    }
  }
}