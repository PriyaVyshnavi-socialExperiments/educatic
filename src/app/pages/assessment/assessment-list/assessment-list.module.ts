import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssessmentListPageRoutingModule } from './assessment-list-routing.module';

import { AssessmentListPage } from './assessment-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssessmentListPageRoutingModule
  ],
  declarations: [AssessmentListPage]
})
export class AssessmentListPageModule {}
