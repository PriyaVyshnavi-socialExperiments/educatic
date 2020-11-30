import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssessmentCategoryPageRoutingModule } from './assessment-category-routing.module';

import { AssessmentCategoryPage } from './assessment-category.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssessmentCategoryPageRoutingModule
  ],
  declarations: [AssessmentCategoryPage]
})
export class AssessmentCategoryPageModule {}
