import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Chart, Point, ChartDataSets } from 'chart.js';
import { IHistoricalData } from '../../shared/historicals-client.service';

@Component({
  selector: 'app-instrument-chart',
  templateUrl: './instrument-chart.component.html',
  styleUrls: ['./instrument-chart.component.scss']
})
export class InstrumentChartComponent implements OnInit {
  chart: Chart;

  @Input() historicals: IHistoricalData[];
  @ViewChild('chartCanvas', { static: true }) canvas: ElementRef;

  constructor() { }

  ngOnInit(): void {
    console.log(this.historicals);
    // todo make on observe
    if (!this.historicals) {
      return;
    }
    const now = Date.now();
    const data: ChartDataSets['data'] =
      this.historicals.map(historical => ({
        x: (new Date(historical.begins_at).getTime() - now) / (1000 * 60 * 60 * 24),
        y: Number(historical.open_price),
      }) as Point);


    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'price ($)',
          data,

        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        }
      }
    });

  }

}
