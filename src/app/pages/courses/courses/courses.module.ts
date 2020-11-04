import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';

import { CoursesPageRoutingModule } from './courses-routing.module';

import { CoursesPage } from './courses.page';
import { MatSelectModule } from '@angular/material/select';
import { CategoryFilterPipe } from '../category-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoursesPageRoutingModule,
    MatSelectModule ,
    NgxIonicImageViewerModule
  ],
  declarations: [CoursesPage, CategoryFilterPipe]
})
export class CoursesPageModule {}
