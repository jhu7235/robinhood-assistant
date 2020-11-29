import { Component, OnInit } from '@angular/core';
import { OptionsClientService } from 'src/app/shared/options-client.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  constructor(private optionsClient: OptionsClientService) { }

  ngOnInit(): void {
    console.log('init TransactionsComponent');
    this.optionsClient.getOrders().subscribe((optionOrders) => {
      console.log(optionOrders.filter(order => order.state === "filled"));
    });
  }

}
