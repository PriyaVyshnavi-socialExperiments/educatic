import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadAssignmentPageRoutingModule } from './upload-assignment-routing.module';

import { UploadAssignmentPage } from './upload-assignment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadAssignmentPageRoutingModule
  ],
  declarations: [UploadAssignmentPage]
})
export class UploadAssignmentPageModule {}
