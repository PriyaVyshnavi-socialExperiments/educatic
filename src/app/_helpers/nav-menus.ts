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
      icon: 'stats-chart',
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
      name: 'Class Room',
      icon: 'text-sharp',
      roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher],
      active: true,
      children: [
        {
          name: 'All Class Rooms',
          path: '/class-rooms',
          icon: 'list',
          roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher],
          active: true
        },
        {
          name: 'Add Class Room',
          path: '/class-room/add',
          icon: 'add-circle',
          roles: [Role.SuperAdmin, Role.SchoolSuperAdmin],
          active: true
        }
      ]
    },
    {
      name: 'Students',
      icon: 'people-sharp',
      roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher],
      active: true,
      children: [
        {
          name: 'All Students',
          path: '/students',
          icon: 'list',
          roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher],
          active: true
        },
        {
          name: 'Add Student',
          path: '/student/add',
          icon: 'add-circle',
          roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher],
          active: true
        }
      ]
    },
    {
      name: 'Course',
      icon: 'school',
      roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher],
      active: true,
      children: [
        {
          name: 'All Course',
          path: '/courses',
          icon: 'list',
          roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher],
          active: true
        },
        {
          name: 'Add Course',
          path: '/course/add',
          icon: 'add-circle',
          roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher],
          active: true
        }
      ]
    },
    {
      name: 'Courses',
      path: '/courses',
      icon: 'school',
      roles: [Role.Student],
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
      name: 'Assignments',
      path: '/assignment/subjects',
      icon: 'reader-outline',
      roles: [Role.Student],
      active: true
    },
    {
      name: 'Assignments',
      path: '/assignment/classes',
      icon: 'reader-outline',
      roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher],
      active: true
    },
    {
      name: 'Offline Websites',
      path: '/offline-websites',
      icon: 'book-outline',
      roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher, Role.Student],
      active: true
    },
  ];

  constructor() { }

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
        menuItem.children = [];
        menu.children.forEach((child) => {
          const submenu = mapMenu(child);
          if (submenu) {
            menuItem.children.push(submenu);
          }
        })
      }
      return menuItem;
    }
    );
  }
}


