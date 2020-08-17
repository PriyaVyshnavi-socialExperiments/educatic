import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassRoomsPageRoutingModule } from './class-rooms-routing.module';

import { ClassRoomsPage } from './class-rooms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClassRoomsPageRoutingModule
  ],
  declarations: [ClassRoomsPage]
})
export class ClassRoomsPageModule {}
