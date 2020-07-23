import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, filter, first } from 'rxjs/operators';
import { MenuItems } from '../_models';
import { AuthenticationService } from '../_services';

@Injectable({
  providedIn: 'root'
})
export class NavMenus {
  public menuItems: MenuItems[] = [];
  private userRole: string[] = [];
  constructor(private http: HttpClient, public auth: AuthenticationService) {
    this.getRoleBaseNavMenus();
  }

  private getNavMenus(): Observable<MenuItems[]> {
    return this.http.get<MenuItems[]>('./assets/menu/nav-menus.json')
      .pipe(map(res => res));
  }

  public getRoleBaseNavMenus() {

    this.auth.currentUser.subscribe( user => {
      if (user.role) {
        this.userRole = [...user.role];
      }
    });
    this.getNavMenus().pipe(first()).subscribe(res => {
      res.filter(menu => {
        this.userRole.forEach( Role => {
          if (menu.active === 'true' && menu.roles.find( role => role.toLowerCase() === Role.toLowerCase())) {
            return this.menuItems.indexOf(menu) >= 0 ? false : this.menuItems.push(menu);
          }
        });
      });
    });
    return this.menuItems;
  }
}
