import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from '../../_services';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  activePath = '';
  currentUser: any;
  pages = [
    {
      name: 'Users',
      path: '/register'
    },
    {
      name: 'Schools',
      path: ''
    },
    {
      name: 'Teachers',
      path: '/contact'
    }
  ];

  constructor(private router: Router, private authenticationService: AuthenticationService) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.activePath = event.url;
    });
  }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
}

}
