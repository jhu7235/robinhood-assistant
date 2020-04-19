import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstrumentsComponent } from './instruments.component';
import { InstrumentComponent } from './instrument/instrument.component';
import { SharedMaterialModule } from '../shared-material/shared-material.module';
import { InstrumentsTableComponent } from './instruments-table/instruments-table.component';
import { ChartComponent } from './chart/chart.component';

@NgModule({
  declarations: [
    InstrumentsComponent,
    InstrumentComponent,
    InstrumentsTableComponent,
    ChartComponent,
  ],
  imports: [
    CommonModule,
    SharedMaterialModule,
  ],
  exports: [
    InstrumentsComponent,
    ChartComponent,
  ]
})
export class InstrumentsModule { }
