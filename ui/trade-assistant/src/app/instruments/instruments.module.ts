import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstrumentsComponent } from './instruments.component';
import { InstrumentComponent } from './instrument/instrument.component';
import { SharedMaterialModule } from '../shared-material/shared-material.module';
import { InstrumentsTableComponent } from './instruments-table/instruments-table.component';
import { ChartModule } from '../chart/chart.module';

@NgModule({
  declarations: [
    InstrumentsComponent,
    InstrumentComponent,
    InstrumentsTableComponent,
  ],
  imports: [
    CommonModule,
    SharedMaterialModule,
    ChartModule,
  ],
  exports: [
    InstrumentsComponent,
  ]
})
export class InstrumentsModule { }
