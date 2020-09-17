import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FilePickerModule} from 'ngx-awesome-uploader';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule, MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';

import { IonicModule } from '@ionic/angular';

import { CourseAddPageRoutingModule } from './course-add-routing.module';

import { CourseAddPage } from './course-add.page';
import { CourseSharePageModule } from '../../course-share/course-share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilePickerModule,
    CourseAddPageRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTabsModule,
    MatMenuModule,
    MaterialFileInputModule,
    CourseSharePageModule,
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [CourseAddPage]
})
export class CourseAddPageModule {}
