import { Component, OnInit, ViewChild } from '@angular/core';
import { OrdersClientService } from '../../shared/orders-client.service';
import { HoldingsService } from '../holdings.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { IHolding } from '../holdings.service';
import { trigger, state, transition, style, animate } from '@angular/animations';


/**
 * Table of holdings
 */
@Component({
  selector: 'app-holdings-table',
  templateUrl: './holdings-table.component.html',
  styleUrls: ['./holdings-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HoldingsTableComponent implements OnInit {
  public holdings: IHolding[] = [];

  // column ordering
  public displayedColumns: string[] = ['symbol', 'name', 'quantity', 'age', 'timestamp'];

  public dataSource: MatTableDataSource<IHolding>;

  @ViewChild(MatPaginator, { static: false })
  public paginator: MatPaginator;

  @ViewChild(MatSort, { static: false })
  public sort: MatSort;

  public totalQuantity = 0;

  public filterValue: string;

  // TODO: type expandedElement
  public expandedRow: IHolding | null;


  constructor(private ordersClient: OrdersClientService, private holdingsService: HoldingsService) { }

  /**
   * Filters table data
   */
  public applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.totalQuantity = this.dataSource.filteredData
      ? this.dataSource.filteredData
        .map(holding => holding.quantity)
        .reduce((q1, q2) => q1 + q2)
      : 0;
  }

  public ngOnInit(): void {
    this.ordersClient.get().pipe().subscribe((orders) => {
      this.holdings = this.holdingsService.buildHoldings(orders);
      this.dataSource = new MatTableDataSource(this.holdings);
      // HACK: if set right away, this.holdings won't be used
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
  }
}
