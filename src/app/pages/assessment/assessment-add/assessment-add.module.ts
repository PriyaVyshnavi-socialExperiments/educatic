import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssessmentAddPageRoutingModule } from './assessment-add-routing.module';

import { AssessmentAddPage } from './assessment-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssessmentAddPageRoutingModule
  ],
  declarations: [AssessmentAddPage]
})
export class AssessmentAddPageModule {}
