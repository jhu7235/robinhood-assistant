import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberPipe } from './number.pipe';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [NumberPipe],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [NumberPipe]
})
export class SharedModule { }
