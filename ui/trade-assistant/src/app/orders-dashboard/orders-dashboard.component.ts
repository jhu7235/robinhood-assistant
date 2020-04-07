import { Component, OnInit } from '@angular/core';
import { OrdersClientService, IOrder, IExecution } from '../orders-client.service';

@Component({
  selector: 'app-orders-dashboard',
  templateUrl: './orders-dashboard.component.html',
  styleUrls: ['./orders-dashboard.component.scss']
})
export class OrdersDashboardComponent implements OnInit {
  public orders: IOrder[];

  constructor(private ordersClient: OrdersClientService) { }

  async ngOnInit(): Promise<void> {
    this.ordersClient.get().subscribe((orders) => {
      this.orders = orders;
    });
  }
}
