import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import FinancialChart from './../chart';
import { Chart } from 'chart.js';
import { HistoricalsClientService, IHistoricals } from '../../shared/historicals-client.service';
import { ONE_YEAR } from 'src/app/shared/client-helper.functions';
import { HistoricalDataService } from 'src/app/shared/historical-data.service';

@Component({
  selector: 'app-instrument-chart',
  templateUrl: './instrument-chart.component.html',
  styleUrls: ['./instrument-chart.component.scss']
})
export class InstrumentChartComponent implements OnInit {
  private chart: Chart;
  private chart2: Chart;

  @Input() symbol: string;
  @ViewChild('chartCanvas', { static: true }) canvas: ElementRef;
  @ViewChild('chartCanvas2', { static: true }) canvas2: ElementRef;

  constructor(
    private historicalClientService: HistoricalsClientService,
    private historicalDataService: HistoricalDataService
  ) { }

  ngOnInit(): void {
    this.historicalClientService.getDaily(this.symbol)
      .subscribe((historicals) => {
        this.buildScatterChart(historicals.data);
        this.buildCandleStickChart(historicals.data);
      });
  }

  buildScatterChart(historicalsMap: IHistoricals) {
    const data = this.historicalDataService.toScatter(
      historicalsMap,
      {
        start: Date.now() - ONE_YEAR,
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

  private buildCandleStickChart(historicalsMap: IHistoricals) {
    const data = this.historicalDataService.toCandleStick(
      historicalsMap,
      {
        start: Date.now() - ONE_YEAR,
        stop: Date.now()
      }
    );
    // store chart locally for updating
    this.chart2 = new FinancialChart(this.canvas2.nativeElement.getContext('2d'), {
      type: 'candlestick',
      data: {
        datasets: [{
          label: this.symbol,
          data
        }]
      },
      options: {
        scales: {
          // xAxes: [{
          //   afterBuildTicks(scale, ticks) {
          //     const majorUnit = scale._majorUnit;
          //     const firstTick = ticks[0];
          //     let i;
          //     let ilen;
          //     let val;
          //     let tick;
          //     let currMajor;
          //     let lastMajor;

          //     val = new Date(ticks[0].value);
          //     if ((majorUnit === 'minute' && val.second === 0)
          //       || (majorUnit === 'hour' && val.minute === 0)
          //       || (majorUnit === 'day' && val.hour === 9)
          //       || (majorUnit === 'month' && val.day <= 3 && val.weekday === 1)
          //       || (majorUnit === 'year' && val.month === 0)) {
          //       firstTick.major = true;
          //     } else {
          //       firstTick.major = false;
          //     }
          //     lastMajor = val.get(majorUnit);

          //     for (i = 1, ilen = ticks.length; i < ilen; i++) {
          //       tick = ticks[i];
          //       val = new Date(ticks[0].value);
          //       currMajor = val.get(majorUnit);
          //       tick.major = currMajor !== lastMajor;
          //       lastMajor = currMajor;
          //     }
          //     return ticks;
          //   }
          // }]
        }
      }
    });
  }
}
