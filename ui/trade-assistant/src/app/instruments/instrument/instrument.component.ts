import { Component, OnInit, Input } from '@angular/core';
import { IInstrument } from '../../shared/instruments-client.service';
import { QuotesClientService, IRobinhoodQuote } from 'src/app/shared/quotes-client.service';

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.component.html',
  styleUrls: ['./instrument.component.scss']
})
export class InstrumentComponent implements OnInit {
  quote: IRobinhoodQuote;
  @Input() instrument: IInstrument;

  constructor(private quotesClientService: QuotesClientService) { }

  ngOnInit(): void {
    this.quotesClientService.get(this.instrument.symbol)
      .subscribe((quote) => (this.quote = quote[0]));
  }
}
