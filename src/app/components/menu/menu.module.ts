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
        loadChildren: () => import('../../pages/courses/courses/courses.module').then(m => m.CoursesPageModule),
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher, Role.Student] }
      },
      {
        path: 'courses/:key',
        loadChildren: () => import('../../pages/courses/courses/courses.module').then(m => m.CoursesPageModule),
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher, Role.Student] }
      },
      {
        path: 'courses/:key/:device',
        loadChildren: () => import('../../pages/courses/courses/courses.module').then(m => m.CoursesPageModule),
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher, Role.Student] }
      },
      {
        path: 'course/add',
        loadChildren: () => import('../../pages/courses/course-add/course-add.module').then(m => m.CourseAddPageModule),
        data: { roles: [Role.SuperAdmin, Role.SchoolSuperAdmin, Role.Teacher] }
      },
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
        loadChildren: () => import('../../pages/viewer/pdf-viewer/pdf-viewer.module')
          .then(m => m.PdfViewerPageModule),
      },
      {
        path: 'content/:id/video-viewer',
        loadChildren: () => import('../../pages/viewer/video-viewer/video-viewer.module')
          .then(m => m.VideoViewerPageModule),
      },
      {
        path: 'assignment/subjects',
        loadChildren: () => import('../../pages/assignment/assignment-subjects/assignment-subjects.module')
          .then(m => m.AssignmentSubjectsPageModule)
      },

      {
        path: 'assignment/:classId/subjects',
        loadChildren: () => import('../../pages/assignment/assignment-subjects/assignment-subjects.module')
          .then(m => m.AssignmentSubjectsPageModule)
      },
      {
        path: 'assignment/classes',
        loadChildren: () => import('../../pages/assignment/assignment-classes/assignment-classes.module')
          .then(m => m.AssignmentClassesPageModule)
      },

      {
        path: 'assignment/:classId/list/:subjectName',
        loadChildren: () => import('../../pages/assignment/assignment-list/assignment-list.module')
          .then(m => m.AssignmentListPageModule),
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'assignment/:classId/upload/:subjectName',
        loadChildren: () => import('../../pages/assignment/upload/assignment-upload.module')
          .then(m => m.AssignmentUploadPageModule)
      },
      {
        path: 'content/:id/image-viewer',
        loadChildren: () => import('../../pages/viewer/image-edit-viewer/image-edit-viewer.module')
        .then( m => m.ImageEditViewerPageModule)
      },
      // {
      //   path: 'assessment/:id',
      //   loadChildren: () => import('../../pages/assessment/assessment.module')
      //   .then( m => m.AssessmentPageModule)
      // },
      {
        path: 'assessments',
        loadChildren: () => import('../../pages/assessment/assessments/assessments.module')
        .then( m => m.AssessmentsPageModule)
      },
      {
        path: 'assessment/quizzes/:subject',
        loadChildren: () => import('../../pages/assessment/assessment-quizzes/assessment-quizzes.module')
        .then( m => m.AssessmentQuizzesPageModule)
      },
      {
        path: 'assessment/:subject/:id/student',
        loadChildren: () => import('../../pages/assessment/assessment/assessment.module')
        .then( m => m.AssessmentPageModule)
      },
      {
        path: 'assessment/quiz/:subject/add',
        loadChildren: () => import('../../pages/assessment/assessment-quiz-add/assessment-quiz-add.module')
        .then( m => m.AssessmentQuizAddPageModule)
      },
      {
        path: 'assessments/quiz/add',
        loadChildren: () => import('../../pages/assessment/assessment-quiz-add/assessment-quiz-add.module')
        .then( m => m.AssessmentQuizAddPageModule)
      },
      {
        path: 'assessment/quiz/:subject/:id/update',
        loadChildren: () => import('../../pages/assessment/assessment-quiz-add/assessment-quiz-add.module')
        .then( m => m.AssessmentQuizAddPageModule)
      },
      {
        path: 'assessment/:subject/:id/questions',
        loadChildren: () => import('../../pages/assessment/assessment-questions/assessment-questions.module')
        .then( m => m.AssessmentQuestionsPageModule)
      },
      {
        path: 'assessment/:subject/:id/question/add',
        loadChildren: () => import('../../pages/assessment/assessment-question-add/assessment-question-add.module')
        .then( m => m.AssessmentQuestionAddPageModule)
      },
      {
        path: 'assessment/:subject/:id/question/update/:questionId',
        loadChildren: () => import('../../pages/assessment/assessment-question-add/assessment-question-add.module')
        .then( m => m.AssessmentQuestionAddPageModule)
      },
      {
        path: 'assessment/share',
        loadChildren: () => import('../../pages/assessment/assessment-share/assessment-share.module')
        .then( m => m.AssessmentSharePageModule)
      },
      {
        path: 'assessment/:subject/solved/:id',
        loadChildren: () => import('../../pages/assessment/assessment-solved/assessment-solved.module')
        .then( m => m.AssessmentSolvedPageModule)
      }
    ],
    runGuardsAndResolvers: 'always',
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