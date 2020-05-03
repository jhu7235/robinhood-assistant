import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';


// a collection of all the material modules that are used.
const sharedMaterialModules = [
  CommonModule,
  MatPaginatorModule,
  MatInputModule,
  MatTableModule,
  MatSortModule,
  MatTabsModule,
  MatDividerModule,
  MatButtonToggleModule,
  MatFormFieldModule,
  ReactiveFormsModule,
  MatButtonModule,
  MatDialogModule,
];

@NgModule({
  declarations: [],
  imports: sharedMaterialModules,
  exports: sharedMaterialModules
})
export class SharedMaterialModule { }
