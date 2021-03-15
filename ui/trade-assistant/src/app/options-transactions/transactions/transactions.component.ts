import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OptionsClientService } from 'src/app/shared/options-client.service';
import { OptionsPerformanceService } from 'src/app/shared/options-performance.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  public displayedColumns = [
    'symbol',
    'date',
    'quantity',
    'cost',
    'effect',
    'strategy',
    'earning',
    'valueToDate',
  ];
  public dataSource: MatTableDataSource<any>;

  constructor(
    private optionsClient: OptionsClientService,
    private optionsPerformance: OptionsPerformanceService
  ) {}

  ngOnInit(): void {
    this.optionsClient.getOrders().subscribe((optionOrders) => {
      const performanceData = this.optionsPerformance.generate(optionOrders);
      this.dataSource = new MatTableDataSource(performanceData);
    });
  }
}
