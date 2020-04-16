import { Component, OnInit } from '@angular/core';
import { HistoricalsClientService, IHistoricalData } from './shared/historicals-client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public historicals: IHistoricalData[];
  constructor(private historicalClientService: HistoricalsClientService) { }

  ngOnInit() {
    this.historicalClientService.get('RCL', '5minute', 'week')
      .subscribe((historicals) => {
        console.log({ historicals });
        this.historicals = historicals.historicals;
      });
  }

}
