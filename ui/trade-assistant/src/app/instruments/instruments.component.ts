import { Component, OnInit } from '@angular/core';
import { InstrumentsClientService, IInstrument } from '../shared/instruments-client.service';

@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.scss']
})
export class InstrumentsComponent implements OnInit {
  public instruments: IInstrument[];

  constructor(private instrumentsClientService: InstrumentsClientService) { }

  public ngOnInit(): void {
    this.instrumentsClientService.get().subscribe((instruments) => {
      console.log({ instruments });
      this.instruments = instruments;
    });
  }

}
