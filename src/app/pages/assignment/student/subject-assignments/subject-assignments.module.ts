import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubjectAssignmentsPageRoutingModule } from './subject-assignments-routing.module';

import { SubjectAssignmentsPage } from './subject-assignments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubjectAssignmentsPageRoutingModule
  ],
  declarations: [SubjectAssignmentsPage]
})
export class SubjectAssignmentsPageModule {}
