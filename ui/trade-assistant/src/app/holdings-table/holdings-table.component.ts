import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { IOrder, IExecution, OrdersClientService } from '../orders-client.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

const MS_PER_DAY = 86400000;

/**
 * Table of holdings
 */
@Component({
  selector: 'app-holdings-table',
  templateUrl: './holdings-table.component.html',
  styleUrls: ['./holdings-table.component.scss']
})
export class HoldingsTableComponent implements OnInit, AfterViewInit {
  public holdings: IExecution[] = [];
  public displayedColumns: string[] = ['symbol', 'quantity', 'age'];
  public dataSource: MatTableDataSource<IExecution>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private ordersClient: OrdersClientService) { }

  public ngOnInit(): void {
    this.ordersClient.get().pipe().subscribe((orders) => {
      this.buildHoldings(orders);
      this.dataSource = new MatTableDataSource(this.holdings);
      // HACK: if set right away, this.holdings won't be used
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }, 0);
    });

  }

  private timestampToAge(timestamp: string): number {
    return Math.floor((Date.now() - new Date(timestamp).getTime()) / MS_PER_DAY);
  }

  /**
   * Gets all the executions from a order
   */
  private ordersToExecutions(orders: IOrder[]): IExecution[] {
    const executions: IExecution[] = [];
    orders.forEach(order => {
      executions.push(...order.executions.map((execution) => ({
        ...execution,
        symbol: order.symbol,
        age: this.timestampToAge(execution.timestamp),
        side: order.side,
      })));
    });
    return executions;
  }

  /**
   * Builds holdings by compiling all executions chronologically.
   */
  private buildHoldings(orders: IOrder[]) {
    const holdings: { [symbol: string]: IExecution[] } = {};
    const executions = this.ordersToExecutions(orders);

    const sorted = executions.sort(this.sortByTimeStamp);
    sorted.forEach(execution => {
      // check holdings for sym
      holdings[execution.symbol] = holdings[execution.symbol]
        ? holdings[execution.symbol] : [];

      if (execution.side === 'buy') {
        holdings[execution.symbol].push(execution);
      } else {
        this.removeSoldOrders(execution, holdings[execution.symbol]);
      }
    });
    Object.keys(holdings).forEach(sym => this.holdings.push(...holdings[sym]));
  }

  /**
   * Modify holdings with sell executions.
   * Robinhood executes sell orders. first in, first out
   */
  private removeSoldOrders(execution: IExecution, holding: IExecution[]) {
    let holdingQuantity = Number(holding[0].quantity);
    let executionQuantity = Number(execution.quantity);
    let count = 0;
    while (executionQuantity > 0) {
      if (++count > 3) { throw new Error(); }
      const diffQuantity = holdingQuantity - executionQuantity;

      if (diffQuantity > 0) {
        executionQuantity = 0;
        holding[0].quantity = diffQuantity.toString();
      } else if (diffQuantity < 0) {
        executionQuantity = diffQuantity;
        holding.shift();
        holdingQuantity = Number(holding[0].quantity) + diffQuantity;
      } else if (diffQuantity === 0) {
        executionQuantity = 0;
        holding.shift();
      }
    }
  }


  /**
   * sorter function that sort items by timestamp
   */
  sortByTimeStamp(a: { timestamp: string }, b: { timestamp: string }) {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  }
}
