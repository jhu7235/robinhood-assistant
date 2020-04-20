import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoldingsComponent } from './holdings.component';
import { HoldingsTableComponent } from './holdings-table/holdings-table.component';
import { SharedMaterialModule } from '../shared-material/shared-material.module';
import { InstrumentsModule } from '../instruments/instruments.module';



@NgModule({
  declarations: [HoldingsComponent, HoldingsTableComponent],
  imports: [
    CommonModule,
    SharedMaterialModule,
    InstrumentsModule,
  ],
  exports: [HoldingsComponent]
})
export class HoldingsModule { }
