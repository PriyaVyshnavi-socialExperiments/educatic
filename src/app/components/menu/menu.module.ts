import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';
import { Role } from '../../_models';


const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: '',
        loadChildren: '../home/home.module#HomePageModule',
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher, Role.Student] }
      },
      {
        path: 'profile',
        loadChildren: '../../pages/user-profile/user-profile.module#UserProfilePageModule',
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher, Role.Student] }
      },
      {
        path: 'schools',
        loadChildren: '../../pages/schools/schools.module#SchoolsPageModule',
        data: { roles: [Role.SuperAdmin] }
      },
      {
        path: 'school-add',
        loadChildren: () => import('../../pages/school-add/school-add.module').then( m => m.SchoolAddPageModule)
      },
      {
        path: 'users',
        loadChildren: '../../pages/users/users.module#UsersPageModule',
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher] }
      },
      {
        path: 'teachers',
        loadChildren: '../../pages/teachers/teachers.module#TeachersPageModule',
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher] }
      },
      {
        path: 'students',
        loadChildren: '../../pages/students/students.module#StudentsPageModule',
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher] }
      },
      {
        path: 'attendance',
        loadChildren: '../../pages/attendance/attendance.module#AttendancePageModule',
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher] }
      }
    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})

export class MenuPageModule { }