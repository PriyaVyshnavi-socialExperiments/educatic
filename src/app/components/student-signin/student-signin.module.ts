import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudentSigninPageRoutingModule } from './student-signin-routing.module';

import { StudentSigninPage } from './student-signin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentSigninPageRoutingModule
  ],
  declarations: [StudentSigninPage]
})
export class StudentSigninPageModule {}
