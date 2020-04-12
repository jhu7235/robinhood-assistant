import { Component, OnInit, Input } from '@angular/core';
import { IRobinhoodInstrument } from '../../shared/instruments-client.service';
import { QuotesClientService, IRobinhoodQuote } from 'src/app/shared/quotes-client.service';
import { HistoricalsClientService } from 'src/app/shared/historicals-client.service';

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.component.html',
  styleUrls: ['./instrument.component.scss']
})
export class InstrumentComponent implements OnInit {
  public quote: IRobinhoodQuote;
  public historicals: any;
  @Input() instrument: IRobinhoodInstrument;

  constructor(
    private quotesClientService: QuotesClientService,
    private historicalClientService: HistoricalsClientService
  ) { }

  ngOnInit(): void {
    this.quotesClientService.get(this.instrument.symbol)
      .subscribe((quote) => (this.quote = quote[0]));

    if (this.instrument.symbol === 'RCL') {
      this.historicalClientService.get(this.instrument.symbol, '5minute', 'week')
        .subscribe((historicals) => {
          console.log({ historicals });
          this.historicals = historicals;
        });
    }
  }
}
