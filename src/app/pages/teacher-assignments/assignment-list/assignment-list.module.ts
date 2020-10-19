import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignmentListPageRoutingModule } from './assignment-list-routing.module';

import { AssignmentListPage } from './assignment-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssignmentListPageRoutingModule
  ],
  declarations: [AssignmentListPage]
})
export class AssignmentListPageModule {}
