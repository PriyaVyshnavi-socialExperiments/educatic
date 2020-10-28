import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignmentSubjectsPageRoutingModule } from './assignment-subjects-routing.module';

import { AssignmentSubjectsPage } from './assignment-subjects.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssignmentSubjectsPageRoutingModule
  ],
  declarations: [AssignmentSubjectsPage]
})
export class AssignmentSubjectsPageModule {}
