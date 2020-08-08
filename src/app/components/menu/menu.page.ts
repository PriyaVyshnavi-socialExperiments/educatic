import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from '../../_services';
import { NavMenuHelper } from '../../_helpers/nav-menus';
import { ISchool } from 'src/app/_models';
import { SchoolService } from 'src/app/_services/school/school.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  activePath = '';
  currentUser: any;
  isRemainder = 0;
  dark = false;
  menuList: any;
  schoolDetails: ISchool;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private schoolService: SchoolService,
    private navMenuHelper: NavMenuHelper) {
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

  public ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      this.currentUser = user;
      if (this.currentUser) {
        this.menuList = this.navMenuHelper.menuItems.filter((menu) => menu !== undefined);
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

  public ToggleDarkMode() {
    document.body.classList.toggle('dark', this.dark);
  }
}
