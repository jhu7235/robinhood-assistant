import { Component, OnInit, Input } from '@angular/core';
import { IRobinhoodInstrument } from '../../shared/instruments-client.service';
import { QuotesClientService, IRobinhoodQuote } from 'src/app/shared/quotes-client.service';

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.component.html',
  styleUrls: ['./instrument.component.scss']
})
export class InstrumentComponent implements OnInit {
  public quote: IRobinhoodQuote;
  public showChart = false;
  @Input() instrument: IRobinhoodInstrument;

  constructor(
    private quotesClientService: QuotesClientService,
  ) { }

  ngOnInit(): void {
    this.quotesClientService.get(this.instrument.symbol)
      // don't show delisted stocks
      .subscribe((quote) => (this.quote = quote && quote[0]));

  }
}
