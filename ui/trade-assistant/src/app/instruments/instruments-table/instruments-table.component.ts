import { Component, OnInit } from '@angular/core';
import { InstrumentsClientService, IInstrument } from 'src/app/shared/instruments-client.service';

@Component({
  selector: 'app-instruments-table',
  templateUrl: './instruments-table.component.html',
  styleUrls: ['./instruments-table.component.scss']
})
export class InstrumentsTableComponent implements OnInit {
  instruments: IInstrument[];

  constructor(private instrumentsClientService: InstrumentsClientService) { }

  public ngOnInit(): void {
    this.instrumentsClientService.get().subscribe((instruments) => {
      console.log({ instruments });
      this.instruments = instruments;
    });
  }

}
