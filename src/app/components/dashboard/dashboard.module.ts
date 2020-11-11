import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list'
import { DashboardComponent } from './dashboard.component';
import { GraphModule } from '../graphs/graph.module';
import { IonicModule } from '@ionic/angular';
import { AgmCoreModule } from '@agm/core';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    MatDividerModule,
    IonicModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    GraphModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCaVheCmHHTlYi2vyi_lZhFZl6xu0GWm8Y'
    }) 
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
