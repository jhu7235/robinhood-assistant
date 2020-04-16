import { Component, OnInit } from '@angular/core';
import { AccountsClientService, IRobinhoodAccount } from '../shared/accounts-client.service';
import { UserClientService } from '../shared/user-client.service';
import { HistoricalsClientService, IHistoricalData } from '../shared/historicals-client.service';


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  accounts: IRobinhoodAccount[];
  user: any;

  constructor(
    private accountsClientService: AccountsClientService,
    private userClientService: UserClientService,

  ) { }

  ngOnInit(): void {
    this.accountsClientService.get().subscribe((accounts) => {
      this.accounts = accounts;
    });

    this.userClientService.get().subscribe((user) => {
      this.user = user;
    });
  }

}
