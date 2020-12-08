import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  IOptionsExecution,
  IRobinhoodOptionsOrder,
  OptionsClientService,
} from 'src/app/shared/options-client.service';

interface IExecution extends IOptionsExecution {
  side: 'sell' | 'buy';
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  public displayedColumns = [
    'symbol',
    'date',
    'quantity',
    'cost',
    'effect',
    'strategy',
    'earning',
    'valueToDate',
  ];
  public dataSource: MatTableDataSource<any>;
  private executionMemo: { [id: string]: IExecution[] } = {};
  private vtd = 0; // value to date

  constructor(private optionsClient: OptionsClientService) {}

  // TODO: move this to a service
  calcEarningExecution(
    openingExecutions: IExecution[],
    closingExecution: IExecution
  ) {
    const lastOpeningExecution =
      openingExecutions[openingExecutions.length - 1];
    const numberOpened = Math.abs(
      Math.round(Number(lastOpeningExecution.quantity))
    );
    const openPrice = Number(lastOpeningExecution.price);
    const numberClosed = Math.abs(
      Math.round(Number(closingExecution.quantity))
    );
    const closePrice = Number(closingExecution.price);
    let closedEarning = 0;
    const sellSide =
      closingExecution.side === 'sell'
        ? closingExecution
        : lastOpeningExecution;
    const buySide =
      closingExecution.side === 'buy' ? closingExecution : lastOpeningExecution;

    const earningPerContract =
      (Number(sellSide.price) - Number(buySide.price)) * 100;
    if (numberOpened === numberClosed) {
      openingExecutions.pop();
      closedEarning = numberOpened * earningPerContract;
    } else if (numberOpened > numberClosed) {
      // FIXME: should not mutate
      lastOpeningExecution.quantity = (numberOpened - numberClosed).toString();
      closedEarning = numberClosed * earningPerContract;
    } else {
      openingExecutions.pop();
      // FIXME: should not mutate
      closingExecution.quantity = (numberClosed - numberOpened).toString();
      closedEarning = numberOpened * earningPerContract;
      closedEarning += this.calcEarningExecution(
        openingExecutions,
        closingExecution
      );
    }
    return closedEarning;
  }

  calcEarningFromOrder(order: IRobinhoodOptionsOrder) {
    let earnings = 0;
    order.legs.forEach((leg) => {
      // NOTE: add side for easier calculation
      const executions: IExecution[] = leg.executions.map((execution) => ({
        ...execution,
        side: leg.side,
      }));
      const openingExecutions = this.executionMemo[leg.option];
      executions.forEach((execution) => {
        earnings += this.calcEarningExecution(openingExecutions, execution);
      });
    });
    return earnings;
  }

  trackOpenings(order: IRobinhoodOptionsOrder) {
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

  ngOnInit(): void {
    console.log('init TransactionsComponent');
    this.optionsClient.getOrders().subscribe((optionOrders) => {
      // TODO: move this to a service
      const filledOrders = optionOrders.filter(
        (order) => order.state === 'filled'
      );

      const formatted = filledOrders.reverse().map((order) => {
        const sign = order.direction === 'debit' ? -1 : 1;
        const cost = Number(order.premium) * Number(order.quantity) * sign;
        let earning: number;
        if (!!order.closing_strategy) {
          earning = this.calcEarningFromOrder(order);
          if (earning > cost && order.closing_strategy.includes('spread')) {
            console.log('ERROR: earning is greater than cost', {
              earning,
              order,
            });
          }
          this.vtd += earning || 0;
        } else {
          this.trackOpenings(order);
        }

        const strategy = order.opening_strategy
          ? (order.opening_strategy as any).replaceAll('_', ' ')
          : (order.closing_strategy as any).replaceAll('_', ' ');

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

      this.dataSource = new MatTableDataSource(formatted);
    });
  }
}
