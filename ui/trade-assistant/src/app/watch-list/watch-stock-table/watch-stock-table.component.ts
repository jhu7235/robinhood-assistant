import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IWatchStock } from '../add-watch-stock-dialog/watch-stock.type';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IQuoteMap, ListWatcherService } from '../list-watcher/list-watcher.service';

@Component({
  selector: 'app-watch-stock-table',
  templateUrl: './watch-stock-table.component.html',
  styleUrls: ['./watch-stock-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class WatchStockTableComponent implements OnInit {
  public watchStocks: IWatchStock[] = [];
  public quotes$: Observable<IQuoteMap>;
  public quotes: IQuoteMap = {};
  // public quotes$: any;

  // column ordering
  public displayedColumns: string[] = ['createdOn', 'symbol', 'price', 'marketPrice'];

  // data
  public dataSource: MatTableDataSource<IWatchStock>;

  @ViewChild(MatPaginator, { static: false })
  public paginator: MatPaginator;

  @ViewChild(MatSort, { static: false })
  public sort: MatSort;

  public filterValue: string;

  // TODO: type expandedElement
  public expandedRow: IWatchStock | null;

  constructor(
    private firestore: AngularFirestore,
    private listWatcherService: ListWatcherService,
  ) { }

  /**
   * Filters table data
   */
  public applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  public ngOnInit(): void {
    const watchStocksSubject = this.createWatchListSubject();

    watchStocksSubject.subscribe(watchStocks => {
      this.dataSource = new MatTableDataSource(watchStocks);
      // HACK: if set right away, this.watchStocks\ won't be used
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }, 0);
    });

    this.listWatcherService.getQuotes(watchStocksSubject)
      .subscribe(quotes => this.quotes = quotes);
  }

  private createWatchListSubject() {
    const subject = new Subject<IWatchStock[]>();
    this.firestore
      .collection<IWatchStock>('watchStocks', ref => ref.where('userEmail', '==', 'jhu7235@gmail.com'))
      .valueChanges()
      .subscribe(subject);
    return subject;

  }
}
