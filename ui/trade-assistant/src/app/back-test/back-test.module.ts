import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackTestComponent } from './back-test.component';
import { InstrumentsModule } from '../instruments/instruments.module';
import { SharedMaterialModule } from '../shared-material/shared-material.module';
import { ChartModule } from '../chart/chart.module';



@NgModule({
  declarations: [BackTestComponent],
  imports: [
    CommonModule,
    ChartModule,
    SharedMaterialModule,
  ],
  exports: [BackTestComponent]
})
export class BackTestModule { }
