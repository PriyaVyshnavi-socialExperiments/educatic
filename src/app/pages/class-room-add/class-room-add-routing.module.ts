import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassRoomAddPage } from './class-room-add.page';

const routes: Routes = [
  {
    path: '',
    component: ClassRoomAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassRoomAddPageRoutingModule {}
