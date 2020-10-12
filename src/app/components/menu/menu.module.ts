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
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin] }
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
        path: 'offline-websites',
        loadChildren: () => import('../../components/offline-websites/offline-websites.module').then(m => m.OfflineWebsitesPageModule)
      },
      {
        path: 'school/add',
        loadChildren: () => import('../../pages/school-add/school-add.module').then(m => m.SchoolAddPageModule)
      },
      {
        path: 'school/edit/:id',
        loadChildren: () => import('../../pages/school-add/school-add.module').then(m => m.SchoolAddPageModule)
      },
      {
        path: 'teachers',
        loadChildren: '../../pages/teachers/teachers.module#TeachersPageModule',
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher] }
      },
      {
        path: 'teachers/:schoolId',
        loadChildren: '../../pages/teachers/teachers.module#TeachersPageModule',
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher] }
      },
      {
        path: 'teacher/add/:schoolId',
        loadChildren: () => import('../../pages/teacher-add/teacher-add.module').then(m => m.TeacherAddPageModule)
      },
      {
        path: 'teacher/edit/:schoolId/:teacherId',
        loadChildren: () => import('../../pages/teacher-add/teacher-add.module').then(m => m.TeacherAddPageModule)
      },
      {
        path: 'teacher/add',
        loadChildren: () => import('../../pages/teacher-add/teacher-add.module').then(m => m.TeacherAddPageModule)
      },
      {
        path: 'class-rooms',
        loadChildren: () => import('../../pages/class-rooms/class-rooms.module').then(m => m.ClassRoomsPageModule)
      },
      {
        path: 'class-rooms/:schoolId',
        loadChildren: () => import('../../pages/class-rooms/class-rooms.module').then(m => m.ClassRoomsPageModule)
      },
      {
        path: 'class-room/add',
        loadChildren: () => import('../../pages/class-room-add/class-room-add.module').then(m => m.ClassRoomAddPageModule)
      },
      {
        path: 'class-room/add/:schoolId',
        loadChildren: () => import('../../pages/class-room-add/class-room-add.module').then(m => m.ClassRoomAddPageModule)
      },
      {
        path: 'class-room/edit/:schoolId/:classId',
        loadChildren: () => import('../../pages/class-room-add/class-room-add.module').then(m => m.ClassRoomAddPageModule)
      },
      {
        path: 'students',
        loadChildren: '../../pages/students/students.module#StudentsPageModule',
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher] }
      },
      {
        path: 'students/:schoolId',
        loadChildren: '../../pages/students/students.module#StudentsPageModule',
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher] }
      },
      {
        path: 'students/:schoolId/:classId',
        loadChildren: '../../pages/students/students.module#StudentsPageModule',
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher] }
      },
      {
        path: 'student/add',
        loadChildren: () => import('../../pages/student-add/student-add.module').then(m => m.StudentAddPageModule),
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher] }
      },
      {
        path: 'student/add/:schoolId',
        loadChildren: () => import('../../pages/student-add/student-add.module').then(m => m.StudentAddPageModule),
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher] }
      },
      {
        path: 'student/add/:schoolId/:classId',
        loadChildren: () => import('../../pages/student-add/student-add.module').then(m => m.StudentAddPageModule),
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher] }
      },
      {
        path: 'student/:schoolId/:classId/edit/:studentId',
        loadChildren: () => import('../../pages/student-add/student-add.module').then(m => m.StudentAddPageModule),
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher] }
      },
      {
        path: ':schoolId/:classId/student/:studentId/photos',
        loadChildren: () => import('../../pages/student-photo-upload/student-photo-upload.module')
          .then(m => m.StudentPhotoUploadPageModule),
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher] }
      },
      {
        path: 'courses',
        loadChildren: () => import('../../pages/courses/courses.module').then(m => m.CoursesPageModule),
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher, Role.Student] }
      },
      {
        path: 'course/add',
        loadChildren: '../../pages/course-add/course-add.module#CourseAddPageModule',
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher, Role.Student] }
      },
      // {
      //   path: 'course/category',
      //   loadChildren: '../../pages/course-category/course-category.module#CourseCategoryPageModule',
      //   data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher] }
      // },
      {
        path: 'attendance',
        loadChildren: '../../pages/attendance/attendance.module#AttendancePageModule',
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher] }
      },
      {
        path: 'attendance/:schoolId/:classId',
        loadChildren: '../../pages/attendance/attendance.module#AttendancePageModule',
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher] }
      },
      {
        path: 'content/:id/pdf-viewer',
        loadChildren: () => import('../../pages/viewer/pdf-viewer/pdf-viewer.module').then(m => m.PdfViewerPageModule),
      },
      {
        path: 'content/:id/video-viewer',
        loadChildren: () => import('../../pages/viewer/video-viewer/video-viewer.module').then(m => m.VideoViewerPageModule),
      },
      {
        path: 'assignments',
        loadChildren: () => import('../../pages/assignments/my-assignments/my-assignments.module').then(m => m.MyAssignmentsPageModule)
      },
      {
        path: 'assignments/:subject',
        loadChildren: () => import('../../pages/assignments/subject-assignments/subject-assignments.module')
        .then(m => m.SubjectAssignmentsPageModule)
      },
      {
        path: 'assignment/:id',
        loadChildren: () => import('../../pages/assignments/upload-assignment/upload-assignment.module')
        .then(m => m.UploadAssignmentPageModule)
      },
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