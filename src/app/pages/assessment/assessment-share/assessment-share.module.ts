import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssessmentSharePageRoutingModule } from './assessment-share-routing.module';

import { AssessmentSharePage } from './assessment-share.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssessmentSharePageRoutingModule
  ],
  declarations: [AssessmentSharePage]
})
export class AssessmentSharePageModule {}
