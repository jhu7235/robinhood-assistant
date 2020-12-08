import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions/transactions.component';
import { SharedMaterialModule } from '../shared-material/shared-material.module';



@NgModule({
  declarations: [TransactionsComponent],
  imports: [
    SharedMaterialModule,
    CommonModule
  ],
  exports: [TransactionsComponent]
})
export class OptionsTransactionsModule { }
