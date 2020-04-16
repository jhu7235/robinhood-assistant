import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { HistoricalsClientService, IHistoricals } from '../../shared/historicals-client.service';
// import * as Chart from 'chart.js';

@Component({
  selector: 'app-instrument-chart',
  templateUrl: './instrument-chart.component.html',
  styleUrls: ['./instrument-chart.component.scss']
})
export class InstrumentChartComponent implements OnInit {
  chart: Chart;

  @Input() symbol: string;
  @ViewChild('chartCanvas', { static: true }) canvas: ElementRef;

  constructor(private historicalClientService: HistoricalsClientService) { }

  ngOnInit(): void {
    this.historicalClientService.get(this.symbol)
      .subscribe((historicals) => this.buildChart(historicals.data));
  }

  buildChart(historicalsMap: IHistoricals) {
    const data: Chart.ChartPoint[] = this.historicalToChartData(historicalsMap);

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

  private historicalToChartData(historicalsMap: IHistoricals): Chart.ChartPoint[] {
    const now = Date.now();
    const data: Chart.ChartPoint[] = [];

    for (const timestamp in historicalsMap) {
      if (historicalsMap.hasOwnProperty(timestamp)) {
        const historical = historicalsMap[timestamp];
        data.push({
          x: (new Date(timestamp).getTime() - now) / (1000 * 60 * 60 * 24),
          y: Number(historical.close),
        } as Chart.ChartPoint);
      }
    }
    return data;
  }

}
