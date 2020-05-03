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
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { WatchListModule } from './watch-list/watch-list.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // Custom Modules
    AccountsModule,
    HoldingsModule,
    SharedModule,
    InstrumentsModule,
    BackTestModule,
    WatchListModule,
    // UI modules
    SharedMaterialModule,
    BrowserAnimationsModule,
    // Firebase module
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
