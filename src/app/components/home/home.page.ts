import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { AuthenticationService } from '../../_services';
import { isMobileDevice } from '../../_helpers';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Role } from 'src/app/_models';
import { SchoolService } from 'src/app/_services/school/school.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild(DashboardComponent) dashboard: DashboardComponent;
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
    this.authenticationService.currentUser?.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
    });
  }

  refreshDashboard() {
    this.dashboard.ngOnInit();
    // this.schoolService.GetPowerBIConfig().subscribe((config) => {
    //   this.powerBIConfig = config[0];
    //   this.powerBIConfig.embedUrl = this.powerBIConfig.embedUrl + '&isMobile=true';
    // })
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.RedirectToRoleSpecificURL();
    });
  }

  onEmbedded(data) {

  }

  private RedirectToRoleSpecificURL() {
    switch (this.currentUser.role) {
      case Role.SuperAdmin:
        this.refreshDashboard();
        this.router.navigate(['/']);
        break;
      case Role.SchoolSuperAdmin:
        this.refreshDashboard();
        this.router.navigate(['/']);
        break;
      case Role.Teacher:
        this.router.navigate(['/class-rooms']);
        break;
      case Role.Student:
        this.router.navigate(['/courses']);
        break;
      default:
        break;
    }
  }
}