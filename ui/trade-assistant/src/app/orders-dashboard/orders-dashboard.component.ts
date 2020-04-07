import { Component, OnInit } from '@angular/core';
import { OrdersClientService, IOrder, IExecution } from '../orders-client.service';

@Component({
  selector: 'app-orders-dashboard',
  templateUrl: './orders-dashboard.component.html',
  styleUrls: ['./orders-dashboard.component.scss']
})
export class OrdersDashboardComponent implements OnInit {
  public orders: IOrder[];
  public holdings: { [sym: string]: IExecution[] } = {};

  constructor(private ordersClient: OrdersClientService) { }

  async ngOnInit(): Promise<void> {
    this.orders = await this.ordersClient.get();
    console.log('got order', this.orders);
    this.buildHoldings();

  }

  /**
   * Gets all the executions from a order
   */
  private ordersToExecutions(orders: IOrder[]): IExecution[] {
    const executions: IExecution[] = [];
    orders.forEach(order => {
      executions.push(...order.executions.map((execution) => ({ ...execution, symbol: order.symbol, side: order.side })));
    });
    return executions;
  }

  /**
   * Builds holdings by compiling all executions chronologically.
   */
  private buildHoldings() {
    const executions = this.ordersToExecutions(this.orders);

    const sorted = executions.sort(this.sortByTimeStamp);
    sorted.forEach(execution => {
      // check holdings for sym
      this.holdings[execution.symbol] = this.holdings[execution.symbol]
        ? this.holdings[execution.symbol] : [];

      console.log(`${execution.symbol} ${execution.side} ${execution.timestamp}`);
      if (execution.side === 'buy') {
        this.holdings[execution.symbol].push(execution);
      } else {
        this.removeSoldOrders(execution);
      }
      console.log({allHoldings: JSON.parse(JSON.stringify(this.holdings))});
    });
  }

  /**
   * Modify holdings with sell executions.
   * Robinhood executes sell orders. first in, first out
   */
  removeSoldOrders(execution: IExecution) {
    let holdingQuantity = Number(this.holdings[execution.symbol][0].quantity);
    let executionQuantity = Number(execution.quantity);
    let count = 0;
    while (executionQuantity > 0) {
      if (++count > 3) { throw new Error(); }
      const diffQuantity = holdingQuantity - executionQuantity;

      if (diffQuantity > 0) {
        executionQuantity = 0;
        this.holdings[execution.symbol][0].quantity = diffQuantity.toString();
      } else if (diffQuantity < 0) {
        console.log({
          execution,
          executionQuantity,
          holdings: JSON.parse(JSON.stringify(this.holdings[execution.symbol]))
        });
        executionQuantity = executionQuantity + diffQuantity;
        this.holdings[execution.symbol].shift();
        holdingQuantity = Number(this.holdings[execution.symbol][0].quantity) + diffQuantity;
      } else if (diffQuantity === 0) {
        executionQuantity = 0;
        this.holdings[execution.symbol].shift();
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
