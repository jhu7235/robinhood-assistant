import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input() symbol: string;

  constructor() { }

  ngOnInit(): void {
  }

  spanChanged(event) {
    console.log('spanChanged', event);
  }
}
