import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { ChartCanvasComponent } from './chart-canvas/chart-canvas.component';
import { SharedMaterialModule } from '../shared-material/shared-material.module';
import { ChartControllerComponent } from '../chart-controller/chart-controller.component';


@NgModule({
  declarations: [
    ChartComponent,
    ChartCanvasComponent,
    ChartControllerComponent,
  ],
  imports: [
    CommonModule,
    SharedMaterialModule,
  ],
  exports: [
    ChartComponent
  ]
})
export class ChartModule { }
