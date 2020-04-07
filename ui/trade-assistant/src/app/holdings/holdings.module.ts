import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoldingsComponent } from './holdings.component';
import { HoldingsTableComponent } from './holdings-table/holdings-table.component';
import { SharedMaterialModule } from '../shared-material/shared-material.module';



@NgModule({
  declarations: [HoldingsComponent, HoldingsTableComponent],
  imports: [
    CommonModule,
    SharedMaterialModule
  ],
  exports: [HoldingsComponent]
})
export class HoldingsModule { }
