import { Component, OnInit } from '@angular/core';
import { InstrumentsClientService, IRobinhoodInstrument } from 'src/app/shared/instruments-client.service';

@Component({
  selector: 'app-instruments-table',
  templateUrl: './instruments-table.component.html',
  styleUrls: ['./instruments-table.component.scss']
})
export class InstrumentsTableComponent implements OnInit {
  public instruments: IRobinhoodInstrument[];

  constructor(
    private instrumentsClientService: InstrumentsClientService,
  ) { }

  public ngOnInit(): void {
    this.instrumentsClientService.get().subscribe((instruments) => {
      this.instruments = instruments;
    });
  }

}
