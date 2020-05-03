import { Injectable } from '@angular/core';
import { combineLatest, Subject, timer } from 'rxjs';
import { IWatchStock } from '../add-watch-stock-dialog/watch-stock.type';
import { switchMap, map } from 'rxjs/operators';
import { QuotesClientService, IRobinhoodQuote } from 'src/app/shared/quotes-client.service';


export interface IQuoteMap {
  [symbol: string]: IRobinhoodQuote;
}

@Injectable({
  providedIn: 'root'
})
export class ListWatcherService {

  constructor(
    private quotesClientService: QuotesClientService
  ) { }

  getQuotes(watchList$: Subject<IWatchStock[]>) {
    return combineLatest([timer(0, 5 * 1000), watchList$]).pipe(
      switchMap(([_, stocks]) => {
        const set = new Set(stocks.map(stock => stock.symbol));
        const symbols = Array.from(set);
        const quoteObsArray = symbols.map((symbol: string) => this.quotesClientService.get(symbol).pipe(map(result => result[0])));
        return combineLatest(quoteObsArray);
      }),
      map(quotes => {
        const quoteMap: IQuoteMap = {};
        quotes.forEach(quote => {
          quoteMap[quote.symbol] = quote;
        });
        return quoteMap;
      })
    );

  }
}


