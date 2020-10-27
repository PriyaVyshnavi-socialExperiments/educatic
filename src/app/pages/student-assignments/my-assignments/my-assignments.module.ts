import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyAssignmentsPageRoutingModule } from './my-assignments-routing.module';

import { MyAssignmentsPage } from './my-assignments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyAssignmentsPageRoutingModule
  ],
  declarations: [MyAssignmentsPage]
})
export class MyAssignmentsPageModule {}
