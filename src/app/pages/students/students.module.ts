import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LazyLoadImageModule, LAZYLOAD_IMAGE_HOOKS } from 'ng-lazyload-image';

import { IonicModule } from '@ionic/angular';
import { StudentsPageRoutingModule } from './students-routing.module';
import { StudentsPage } from './students.page';
import { LazyLoadImageHooks } from 'src/app/_helpers/lazy-load-image-hook';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LazyLoadImageModule,
    StudentsPageRoutingModule
  ],
  providers: [{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: LazyLoadImageHooks }],
  declarations: [StudentsPage]
})
export class StudentsPageModule {}
