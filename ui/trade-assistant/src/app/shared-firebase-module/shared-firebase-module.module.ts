import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';


const sharedModules = [
  CommonModule,
  AngularFireModule.initializeApp(environment.firebase) as any,
  AngularFireAnalyticsModule,
  AngularFirestoreModule
];


@NgModule({
  declarations: [],
  imports: sharedModules,
  exports: sharedModules,
})
export class SharedFirebaseModuleModule { }
