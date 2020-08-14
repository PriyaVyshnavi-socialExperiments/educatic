import { Injectable } from '@angular/core';
import { IMenuItems } from '../_models/menu-items';
import { Role } from '../_models/role';

@Injectable({
  providedIn: 'root'
})

export class NavMenuHelper {

  private menuList = [
    {
      name: 'Dashboard',
      icon: 'cellular',
      path: '/',
      roles: [Role.SuperAdmin, Role.SchoolSuperAdmin],
      active: true,
    },
    {
      name: 'School',
      icon: 'business-outline',
      roles: [Role.SuperAdmin],
      active: true,
      children: [
        {
          name: 'All Schools',
          path: '/schools',
          icon: 'list',
          roles: [Role.SuperAdmin],
          active: true
        },
        {
          name: 'Add School',
          path: '/school/add',
          icon: 'add-circle',
          roles: [Role.SuperAdmin],
          active: true
        }
      ]
    },
    // {
    //   name: 'Users',
    //   path: '/users',
    //   icon: 'people-outline',
    //   roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher],
    //   active: true
    // },
    {
      name: 'Teacher',
      icon: 'newspaper-outline',
      roles: [Role.SuperAdmin, Role.SchoolSuperAdmin],
      active: true,
      children: [
        {
          name: 'All Teachers',
          path: '/teachers',
          icon: 'list',
          roles: [Role.SuperAdmin, Role.SchoolSuperAdmin],
          active: true
        },
        {
          name: 'Add Teacher',
          path: '/teacher/add',
          icon: 'add-circle',
          roles: [Role.SuperAdmin, Role.SchoolSuperAdmin],
          active: true
        }
      ]
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

  constructor() {}

  public GetMenuList(userRole: string): IMenuItems[] {
    const mapMenu = (menu) => {
      if (menu.roles.includes(Role[userRole])) {
        const menuItem = {} as IMenuItems;
        menuItem.active = menu.active;
        menuItem.icon = menu.icon;
        menuItem.iconClass = menu.icon;
        menuItem.name = menu.name;
        menuItem.path = menu.path;
        menuItem.roles = menu.roles
        return menuItem;
      }
    };

    return this.menuList.map((menu) => {
      let menuItem = {} as IMenuItems;
      menuItem = mapMenu(menu);
      if (menuItem && menu?.children && menu?.children?.length > 0) {
        menuItem.children =[];
        menu.children.forEach((m) => {
          const submenu = mapMenu(m);
          menuItem.children.push(submenu);
        })
      }
      return menuItem;
    }
    );
  }
}


