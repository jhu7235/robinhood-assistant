import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddWatchStockDialogComponent } from './add-watch-stock-dialog/add-watch-stock-dialog.component';
import { IWatchStock } from './add-watch-stock-dialog/watch-stock.type';

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.scss']
})
export class WatchListComponent implements OnInit {

  watchStocks$: Observable<IWatchStock[]>;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void { }

  openAddDialog() {
    this.dialog.open(AddWatchStockDialogComponent);
  }
}
