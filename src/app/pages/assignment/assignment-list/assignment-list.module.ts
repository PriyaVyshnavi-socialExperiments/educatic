import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ToastUiImageEditorModule } from 'ngx-tui-image-editor';
import { AssignmentListPageRoutingModule } from './assignment-list-routing.module';

import { AssignmentListPage } from './assignment-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ToastUiImageEditorModule,
    AssignmentListPageRoutingModule
  ],
  providers: [DatePipe],
  declarations: [AssignmentListPage]
})
export class AssignmentListPageModule {}
