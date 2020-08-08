import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeacherAddPageRoutingModule } from './teacher-add-routing.module';

import { TeacherAddPage } from './teacher-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeacherAddPageRoutingModule
  ],
  declarations: [TeacherAddPage]
})
export class TeacherAddPageModule {}
