import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MenuItems, Role } from '../_models';
import { AuthenticationService } from '../_services';

@Injectable({
  providedIn: 'root'
})
export class NavMenuHelper {
  private menuItems: MenuItems[] = [];
  private userRole: string;

  private menuList = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: 'business-outline',
      roles: [Role.SuperAdmin],
      active: true
    },
    {
      name: 'Schools',
      path: '/schools',
      icon: 'business-outline',
      roles: [Role.SuperAdmin],
      active: true
    },
    {
      name: 'Users',
      path: '/users',
      icon: 'people-outline',
      roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher],
      active: true
    },
    {
      name: 'Teachers',
      path: '/teachers',
      icon: 'newspaper-outline',
      roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher],
      active: true
    },
    {
      name: 'Attendance',
      path: '/attendance',
      icon: 'calendar-outline',
      roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher],
      active: true
    },
    {
      name: 'Students',
      path: '/students',
      icon: 'school-outline',
      roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher, Role.Student],
      active: true
    },
  ];

  constructor(private http: HttpClient, public auth: AuthenticationService) {
    this.auth.currentUser.subscribe(user => {
      if (user.role) {
        this.userRole = user.role;
      }
    });
  }

  public get MenuList(): MenuItems[] {
    return this.menuList.map((menu) => {
      if (menu.roles.includes(Role[this.userRole])) {
          const menuItem = {} as MenuItems;
          menuItem.active = menu.active;
          menuItem.icon = menu.icon;
          menuItem.iconClass = menu.icon;
          menuItem.name = menu.name;
          menuItem.path = menu.path;
          menuItem.roles = menu.roles
          return menuItem;
      }
    }
    );
  }
}


