import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchListComponent } from './watch-list.component';
import { SharedFirebaseModuleModule } from '../shared-firebase-module/shared-firebase-module.module';
import { SharedMaterialModule } from '../shared-material/shared-material.module';
import { AddWatchStockDialogComponent } from './add-watch-stock-dialog/add-watch-stock-dialog.component';
import { WatchStockTableComponent } from './watch-stock-table/watch-stock-table.component';
import { InstrumentsModule } from '../instruments/instruments.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    WatchListComponent,
    AddWatchStockDialogComponent,
    WatchStockTableComponent

  ],
  imports: [
    CommonModule,
    SharedMaterialModule,
    SharedFirebaseModuleModule,
    InstrumentsModule,

    BrowserAnimationsModule,
  ],
  exports: [WatchListComponent]
})
export class WatchListModule { }
