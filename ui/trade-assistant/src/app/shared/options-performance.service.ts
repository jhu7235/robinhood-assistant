import { Injectable } from '@angular/core';
import {
  IOptionsExecution,
  IRobinhoodOptionsOrder,
} from './options-client.service';

interface IExecution extends IOptionsExecution {
  side: 'sell' | 'buy';
}

@Injectable({
  providedIn: 'root',
})
export class OptionsPerformanceService {
  constructor() {}

  private executionMemo: { [id: string]: IExecution[] } = {};
  private vtd = 0; // value to date

  private getSides(e1: IExecution, e2: IExecution) {
    if (e1.side === 'sell') {
      return { sellSide: e1, buySide: e2 };
    } else {
      return { sellSide: e2, buySide: e1 };
    }
  }

  private cleanUpMemo(optionUrl: string) {
    if (this.executionMemo && !this.executionMemo[optionUrl].length) {
      delete this.executionMemo[optionUrl];
    }
  }

  private calcEarningExecution(
    openExecutions: IExecution[],
    closeExecution: IExecution
  ) {
    const openExecution = openExecutions[openExecutions.length - 1];
    const numberOpened = Math.abs(Math.round(Number(openExecution.quantity)));
    const numberClosed = Math.abs(Math.round(Number(closeExecution.quantity)));
    let earning = 0;
    const { sellSide, buySide } = this.getSides(closeExecution, openExecution);

    const earningPerContract =
      (Number(sellSide.price) - Number(buySide.price)) * 100;
    if (numberOpened === numberClosed) {
      openExecutions.pop();
      earning = numberOpened * earningPerContract;
    } else if (numberOpened > numberClosed) {
      openExecution.quantity = (numberOpened - numberClosed).toString();
      earning = numberClosed * earningPerContract;
    } else {
      openExecutions.pop();
      closeExecution.quantity = (numberClosed - numberOpened).toString();
      earning = numberOpened * earningPerContract;
      earning += this.calcEarningExecution(openExecutions, closeExecution);
    }
    return earning;
  }

  private calcEarningFromOrder(order: IRobinhoodOptionsOrder) {
    let earnings = 0;
    order.legs.forEach((leg) => {
      // NOTE: add side for easier calculation
      const executions: IExecution[] = leg.executions.map((execution) => ({
        ...execution,
        side: leg.side,
      }));
      const openExecutions = this.executionMemo[leg.option];
      executions.forEach((execution) => {
        earnings += this.calcEarningExecution(openExecutions, execution);
        this.cleanUpMemo(leg.option);
      });
    });
    return earnings;
  }

  private trackOpenings(order: IRobinhoodOptionsOrder) {
    order.legs.forEach((leg) => {
      const executions: IExecution[] = leg.executions.map((execution) => ({
        ...execution,
        side: leg.side,
      }));

      if (!this.executionMemo[leg.option]) {
        this.executionMemo[leg.option] = [];
      }
      this.executionMemo[leg.option].push(...executions);
    });
  }

  private validateEarning(earning, cost, order) {
    if (earning > cost && order.closing_strategy.includes('spread')) {
      console.log({
        earning,
        order,
      });
      throw new Error('ERROR: earning is greater than cost');
    }
  }

  /**
   * Generates earning data from orders
   */
  generate(optionOrders: IRobinhoodOptionsOrder[]) {
    const filledOrders = optionOrders.filter(
      (order) => order.state === 'filled'
    );

    const formatted = filledOrders.reverse().map((o) => {
      const order = JSON.parse(JSON.stringify(o));
      const sign = order.direction === 'debit' ? -1 : 1;
      const cost = Number(order.premium) * Number(order.quantity) * sign;
      let earning: number;
      if (!!order.closing_strategy) {
        earning = this.calcEarningFromOrder(order);
        this.validateEarning(earning, cost, order);
        this.vtd += earning || 0;
      } else {
        this.trackOpenings(order);
      }

      const strategy = this.getStrategy(order);

      return {
        date: new Date(order.updated_at),
        strategy,
        quantity: order.quantity,
        effect: order.opening_strategy ? 'open' : 'close',
        symbol: order.chain_symbol,
        cost,
        earning,
        valueToDate: this.vtd,
      };
    });
    console.log(this.executionMemo);

    return formatted;
  }
  private getStrategy(order: IRobinhoodOptionsOrder) {
    return order.opening_strategy
      ? (order.opening_strategy as any).replaceAll('_', ' ')
      : (order.closing_strategy as any).replaceAll('_', ' ');
  }
}
