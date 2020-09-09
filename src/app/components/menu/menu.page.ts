import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from '../../_services';
import { NavMenuHelper } from '../../_helpers/nav-menus';
import { ISchool, IUser } from '../../_models';
import { SchoolService } from '../../_services/school/school.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit, OnDestroy {

  activePath = '';
  currentUser: IUser;
  isRemainder = 0;
  dark = false;
  menuList: any;
  schoolDetails: ISchool;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public menuCtrl: MenuController,
    private schoolService: SchoolService) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.activePath = event.url;
    });
    const prefersColor = window.matchMedia('(prefers-color-scheme: light)');
    this.dark = prefersColor.matches;
    this.ToggleDarkMode();

    prefersColor.addEventListener(
      'change',
      mediaQuery => {
        this.dark = mediaQuery.matches;
        this.ToggleDarkMode();
      }
    );
  }
  ngOnDestroy(): void {
  }

  public ngOnInit() {
    this.authenticationService.ready.subscribe((user) => {
      this.currentUser = user;
      if (this.currentUser) {
        this.menuList = this.currentUser.menuItems.filter((menu) => menu !== undefined && menu !== null);
        this.currentUser.menuItems = this.menuList;
      }
    });

    this.schoolService.getSchoolDetails().subscribe((school) => {
      this.schoolDetails = school;
    });
  }

  public Logout() {
    this.authenticationService.Logout();
    this.menuList = [];
    this.router.navigate(['/login']);
  }

  public Profile() {
    this.menuCtrl.toggle();
    this.router.navigate(['/profile']);
  }

  public ToggleDarkMode() {
    document.body.classList.toggle('dark', this.dark);
  }
}
