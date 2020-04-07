import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsComponent } from './accounts.component';
import { SharedMaterialModule } from '../shared-material/shared-material.module';



@NgModule({
  declarations: [AccountsComponent],
  imports: [
    CommonModule,
    SharedMaterialModule
  ],
  exports: [AccountsComponent]
})
export class AccountsModule { }
