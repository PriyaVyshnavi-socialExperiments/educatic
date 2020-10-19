import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignmentViewPageRoutingModule } from './assignment-view-routing.module';

import { AssignmentViewPage } from './assignment-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssignmentViewPageRoutingModule
  ],
  declarations: [AssignmentViewPage]
})
export class AssignmentStudentViewPageModule {}
