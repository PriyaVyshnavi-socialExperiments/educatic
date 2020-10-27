import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
 {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>  import('./components/menu/menu.module').then(m => m.MenuPageModule),
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
