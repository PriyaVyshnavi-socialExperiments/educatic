import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignmentStudentsPageRoutingModule } from './assignment-students-routing.module';

import { AssignmentStudentsPage } from './assignment-students.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssignmentStudentsPageRoutingModule
  ],
  declarations: [AssignmentStudentsPage]
})
export class AssignmentStudentsPageModule {}
