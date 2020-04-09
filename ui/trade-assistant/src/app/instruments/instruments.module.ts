import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstrumentsComponent } from './instruments.component';
import { InstrumentComponent } from './instrument/instrument.component';
import { SharedMaterialModule } from '../shared-material/shared-material.module';



@NgModule({
  declarations: [InstrumentsComponent, InstrumentComponent],
  imports: [
    CommonModule,
    SharedMaterialModule,
  ],
  exports: [InstrumentsComponent]
})
export class InstrumentsModule { }
