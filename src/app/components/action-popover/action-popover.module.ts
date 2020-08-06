import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActionPopoverPageRoutingModule } from './action-popover-routing.module';

import { ActionPopoverPage } from './action-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActionPopoverPageRoutingModule
  ],
  declarations: [ActionPopoverPage]
})
export class ActionPopoverPageModule {}
