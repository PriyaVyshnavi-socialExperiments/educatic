import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainCognitiveServicePageRoutingModule } from './train-cognitive-service-routing.module';

import { TrainCognitiveServicePage } from './train-cognitive-service.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainCognitiveServicePageRoutingModule
  ],
  declarations: [TrainCognitiveServicePage]
})
export class TrainCognitiveServicePageModule {}
