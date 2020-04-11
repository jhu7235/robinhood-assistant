import { Component, OnInit } from '@angular/core';
import { InstrumentsClientService, IInstrument } from '../shared/instruments-client.service';

@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.scss']
})
export class InstrumentsComponent implements OnInit {
  constructor(private instrumentsClientService: InstrumentsClientService) { }

  public ngOnInit(): void {
  }
}
