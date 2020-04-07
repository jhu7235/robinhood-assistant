import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrdersDashboardComponent } from './orders-dashboard/orders-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HoldingsTableComponent } from './holdings-table/holdings-table.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NumberPipe } from './number.pipe';
import { MatSortModule } from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [
    AppComponent,
    OrdersDashboardComponent,
    HoldingsTableComponent,
    NumberPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    MatPaginatorModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
