import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsComponent } from './charts/charts.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'; 
import { IonicModule } from '@ionic/angular';
import { FilterComponent } from './filter/filter.component';
import { ModalPage } from './modal/modal.page';
import { FormsModule } from '@angular/forms';
import { BarChartComponent } from './bar-chart/bar-chart.component';


@NgModule({
  declarations: [
    ChartsComponent,
    FilterComponent,
    ModalPage,
    BarChartComponent,
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
    ChartsComponent,
    FilterComponent,
    ModalPage,
    BarChartComponent,
  ]
})
export class GraphModule { }
