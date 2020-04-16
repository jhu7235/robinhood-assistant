import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstrumentsComponent } from './instruments.component';
import { InstrumentComponent } from './instrument/instrument.component';
import { SharedMaterialModule } from '../shared-material/shared-material.module';
import { InstrumentsTableComponent } from './instruments-table/instruments-table.component';
import { InstrumentChartComponent } from './instrument-chart/instrument-chart.component';

@NgModule({
  declarations: [
    InstrumentsComponent,
    InstrumentComponent,
    InstrumentsTableComponent,
    InstrumentChartComponent,
  ],
  imports: [
    CommonModule,
    SharedMaterialModule,
  ],
  exports: [
    InstrumentsComponent,
    InstrumentChartComponent,
  ]
})
export class InstrumentsModule { }
