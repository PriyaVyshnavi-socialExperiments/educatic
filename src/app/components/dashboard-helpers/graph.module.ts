import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'; 
import { IonicModule } from '@ionic/angular';
import { BingMapComponent } from './bing-map/bing-map.component';
import { FormsModule } from '@angular/forms';
import { ModalPopUpComponent } from './modal-pop-up/modal-pop-up.component';



@NgModule({
  declarations: [
    BingMapComponent,
    ModalPopUpComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    IonicModule,
    FormsModule,
  ],
  exports: [
    ModalPopUpComponent,
    BingMapComponent
  ]
})
export class GraphModule { }
