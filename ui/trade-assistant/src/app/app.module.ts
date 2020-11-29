import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountsModule } from './accounts/accounts.module';
import { HoldingsModule } from './holdings/holdings.module';
import { SharedModule } from './shared/shared.module';
import { SharedMaterialModule } from './shared-material/shared-material.module';
import { InstrumentsModule } from './instruments/instruments.module';
import { BackTestModule } from './back-test/back-test.module';
import { OptionsTransactionsModule } from './options-transactions/options-transactions.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    AccountsModule,
    HoldingsModule,
    SharedModule,
    InstrumentsModule,
    BackTestModule,
    OptionsTransactionsModule,

    SharedMaterialModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
