import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassRoomsPageRoutingModule } from './class-rooms-routing.module';

import { ClassRoomsPage } from './class-rooms.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClassRoomsPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [ClassRoomsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClassRoomsPageModule {}
