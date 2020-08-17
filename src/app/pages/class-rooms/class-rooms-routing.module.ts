import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassRoomsPage } from './class-rooms.page';

const routes: Routes = [
  {
    path: '',
    component: ClassRoomsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassRoomsPageRoutingModule {}
