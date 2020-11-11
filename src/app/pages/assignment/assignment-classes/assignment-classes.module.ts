import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignmentClassesPageRoutingModule } from './assignment-classes-routing.module';

import { AssignmentClassesPage } from './assignment-classes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssignmentClassesPageRoutingModule
  ],
  declarations: [AssignmentClassesPage]
})
export class AssignmentClassesPageModule {}
