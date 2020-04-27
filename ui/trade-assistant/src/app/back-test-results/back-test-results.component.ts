import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { IHistorical } from '../shared/historicals-client.service';

@Component({
  selector: 'app-back-test-results',
  templateUrl: './back-test-results.component.html',
  styleUrls: ['./back-test-results.component.scss']
})
export class BackTestResultsComponent implements OnInit, OnChanges {

  @Input()
  public results: any[];
  @Input()
  public today: IHistorical;

  // column ordering
  public displayedColumns: string[] = ['date', 'drop', 'price', 'shares', 'equity', 'oneYearChange'];

  @ViewChild(MatSort, { static: true })
  public sort: MatSort;

  @ViewChild(MatPaginator, { static: false })
  public paginator: MatPaginator;

  // TODO: fix type
  public dataSource: MatTableDataSource<any[]>;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new MatTableDataSource(this.formatData(this.results));
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, 100);
  }

  private formatData(results: any[]) {
    return results.map((result: any) => ({
      ...result,
      date: result.today.timestamp,
      price: (result.today.historical.high + result.today.historical.close) / 2,
      oneYearChange: result.oneYearLater.change.percent,
      drop: result.trigger.percent
    }));
  }

  public getCurrentEquity(): number {
    return this.getCurrentShares() * this.today.close;
  }

  public getCurrentShares() {
    return this.results[this.results.length - 1].shares;
  }
}
