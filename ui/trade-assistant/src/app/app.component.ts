import { Component } from '@angular/core';
import { OrdersClientService } from './orders-client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'trade-assistant';
  constructor(private ordersClient: OrdersClientService) {

  }

  public async getOrders() {
    console.log('getting orders');
    const orders = await this.ordersClient.get();
    console.log(orders);

  }
}
