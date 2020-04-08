import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';


const sharedMaterialModules = [
  CommonModule,
  MatPaginatorModule,
  MatInputModule,
  MatTableModule,
  MatSortModule,
  MatTabsModule,
];

@NgModule({
  declarations: [],
  imports: sharedMaterialModules,
  exports: sharedMaterialModules
})
export class SharedMaterialModule { }
