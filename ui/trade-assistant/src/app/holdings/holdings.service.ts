import { Injectable } from '@angular/core';
import { IOrder, IRobinhoodExecution } from '../shared/orders-client.service';


const MS_PER_DAY = 86400000;

export interface IHolding extends Omit<IRobinhoodExecution, 'quantity'> {
  symbol: string;
  name: string;
  side: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class HoldingsService {

  private timestampToAge(timestamp: string): number {
    return Math.floor((Date.now() - new Date(timestamp).getTime()) / MS_PER_DAY);
  }

  /**
   * Gets all the executions from a order
   */
  private ordersToExecutions(orders: IOrder[]): IHolding[] {
    const executions: IHolding[] = [];
    orders.forEach(order => {
      executions.push(...order.executions.map((execution) => ({
        ...execution,
        quantity: Number(execution.quantity),
        symbol: order.symbol,
        name: order.name,
        age: this.timestampToAge(execution.timestamp),
        side: order.side,
      })));
    });
    return executions;
  }

  private mapToArray(holdingsMap: { [symbol: string]: IHolding[] }): IHolding[]{
    const holdings = [];
    Object.keys(holdingsMap).forEach(sym => holdings.push(...holdingsMap[sym]));
    return holdings;
  }

  /**
   * Builds holdings by compiling all executions chronologically.
   * TODO: unit test
   */
  public buildHoldings(orders: IOrder[]) {
    const holdings: { [symbol: string]: IHolding[] } = {};
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

    return this.mapToArray(holdings);
  }

  /**
   * Modify holdings with sell executions.
   * Robinhood executes sell orders. first in, first out
   */
  private removeSoldOrders(execution: IHolding, holdings: IHolding[]) {
    while (execution.quantity > 0) {
      let unexecutedQuantity = execution.quantity - holdings[0].quantity;
      if (unexecutedQuantity < 0) {
        unexecutedQuantity = 0;
        holdings[0].quantity -= execution.quantity;
      } else if (unexecutedQuantity > 0) {
        holdings.shift();
      } else if (unexecutedQuantity === 0) {
        holdings.shift();
      }
      execution.quantity = unexecutedQuantity;
    }
  }


  /**
   * sorter function that sort items by timestamp
   */
  sortByTimeStamp(a: { timestamp: string }, b: { timestamp: string }) {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  }
}
