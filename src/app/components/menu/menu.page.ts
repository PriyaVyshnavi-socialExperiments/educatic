import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from '../../_services';
import { NavMenuHelper } from '../../_helpers';

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

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
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

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      this.currentUser = user;
      if (this.currentUser) {
        this.menuList = this.navMenuHelper.menuItems.filter((menu) => menu !== undefined);
      }
    });
  }

  logout() {
    this.authenticationService.logout();
    this.menuList = [];
    this.router.navigate(['/login']);
  }

  ToggleDarkMode() {
    document.body.classList.toggle('dark', this.dark);
  }

}
