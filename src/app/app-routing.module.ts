import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
 {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>  import('./components/menu/menu.module').then(m => m.MenuPageModule)
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./components/authentication/authentication.module').then(
        m => m.AuthenticationModule
      )
  },
  {
    path: 'action-popover',
    loadChildren: () => import('./components/action-popover/action-popover.module').then( m => m.ActionPopoverPageModule)
  },
  // {
  //   path: 'course-share',
  //   loadChildren: () => import('./pages/course-share/course-share.module').then( m => m.CourseSharePageModule)
  // },
  // {
  //   path: 'course-category',
  //   loadChildren: () => import('./pages/course-category/course-category.module').then( m => m.CourseCategoryPageModule)
  // },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
