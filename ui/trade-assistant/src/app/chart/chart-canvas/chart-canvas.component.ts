import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import FinancialChart from '../../instruments/chart';
import { Chart } from 'chart.js';
import { HistoricalsClientService, IHistoricals } from '../../shared/historicals-client.service';
import { ONE_YEAR, ONE_MONTH, ONE_DAY } from 'src/app/shared/client-helper.functions';
import { HistoricalDataService } from 'src/app/shared/historical-data.service';

@Component({
  selector: 'app-chart-canvas',
  templateUrl: './chart-canvas.component.html',
  styleUrls: ['./chart-canvas.component.scss']
})
export class ChartCanvasComponent implements OnInit, OnChanges {

  constructor(
    private historicalClientService: HistoricalsClientService,
    private historicalDataService: HistoricalDataService
  ) { }
  private chart: Chart;

  @Input() symbol: string;
  @Input() interval: string;
  @ViewChild('chartCanvas', { static: true }) canvas: ElementRef;

  private getSpan() {
    switch (this.interval) {
      case 'intraday':
        return ONE_DAY;
      case 'daily':
        return 3 * ONE_MONTH;
      case 'weekly':
        return 6 * ONE_MONTH;
      case 'monthly':
        return Infinity;
      default:
        throw new Error('cannot map interval to expire age');
    }
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.interval.currentValue !== changes.interval.previousValue) {
      this.historicalClientService.get(this.symbol, changes.interval.currentValue)
        .subscribe((historicals) => {
          // TODO: remove when not needed anymore
          // this.buildScatterChart(historicals.data);
          this.buildCandleStickChart(historicals.data);
        });
    }

  }

  private buildScatterChart(historicalsMap: IHistoricals) {
    const data = this.historicalDataService.toScatter(
      historicalsMap,
      {
        start: Date.now() - this.getSpan(),
        stop: Date.now()
      }
    );

    // store chart locally for updating
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'scatter',
      data: {
        datasets: [{
          label: this.symbol,
          data,
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }


  /**
   * If it's the Saturday or Sunday don't move the frame to Friday
   */
  private getLastTime() {
    const weekday = new Date().getDay();
    let dateDifference = 0;
    if (weekday === 0) {
      dateDifference = 2;
    } else if (weekday === 6) {
      dateDifference = 1;
    }
    const latestDate = new Date();
    latestDate.setDate(latestDate.getDate() - dateDifference);
    latestDate.setUTCHours(18 + 4); // 6pm EST
    return latestDate.getTime();
  }

  private buildCandleStickChart(historicalsMap: IHistoricals) {
    const lastTime = this.getLastTime();
    const data = this.historicalDataService.toCandleStick(
      historicalsMap,
      {
        start: lastTime - this.getSpan(),
        stop: lastTime
      }
    );

    if (this.chart) {
      this.chart.data.datasets[0].data = data;
      this.chart.update();
      return;
    }

    // store chart locally for updating
    this.chart = new FinancialChart(this.canvas.nativeElement.getContext('2d'), {
      type: 'candlestick',
      data: {
        datasets: [{
          label: this.symbol,
          data,
        }],
      },
    });
  }
}
