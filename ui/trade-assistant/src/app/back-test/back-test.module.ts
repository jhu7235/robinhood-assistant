import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackTestComponent } from './back-test.component';
import { SharedMaterialModule } from '../shared-material/shared-material.module';
import { ChartModule } from '../chart/chart.module';
import { BackTestResultsComponent } from '../back-test-results/back-test-results.component';



@NgModule({
  declarations: [BackTestComponent, BackTestResultsComponent],
  imports: [
    CommonModule,
    ChartModule,
    SharedMaterialModule,
  ],
  exports: [BackTestComponent]
})
export class BackTestModule { }
