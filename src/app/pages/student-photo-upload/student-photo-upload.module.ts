import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LazyLoadImageModule, LAZYLOAD_IMAGE_HOOKS } from 'ng-lazyload-image';
import { IonicModule } from '@ionic/angular';

import { StudentPhotoUploadPageRoutingModule } from './student-photo-upload-routing.module';

import { StudentPhotoUploadPage } from './student-photo-upload.page';
import { LazyLoadImageHooks } from 'src/app/_helpers/lazy-load-image-hook';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LazyLoadImageModule,
    StudentPhotoUploadPageRoutingModule
  ],
  providers: [{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: LazyLoadImageHooks }],
  declarations: [StudentPhotoUploadPage]
})
export class StudentPhotoUploadPageModule {}
