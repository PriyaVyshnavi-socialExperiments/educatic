import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudentPhotoUploadPageRoutingModule } from './student-photo-upload-routing.module';

import { StudentPhotoUploadPage } from './student-photo-upload.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentPhotoUploadPageRoutingModule
  ],
  declarations: [StudentPhotoUploadPage]
})
export class StudentPhotoUploadPageModule {}
