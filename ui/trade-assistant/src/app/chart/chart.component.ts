import { Component, OnInit, Input } from '@angular/core';
import { IInterval } from '../shared/historicals-client.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input() symbol: string;
  interval: IInterval = 'monthly';

  constructor() { }

  ngOnInit(): void {
  }

  onIntervalChanged(event) {
    this.interval = event.value;
  }
}
