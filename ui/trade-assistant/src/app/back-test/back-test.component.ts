import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HistoricalsClientService } from '../shared/historicals-client.service';
import { BackTestService } from '../shared/back-test.service';
import { Subscription } from 'rxjs';

// TODO: associated this with IRobinhoodInstrument | IHolding
interface IInstrument {
  symbol: string;
  simple_name: string;
}

@Component({
  selector: 'app-back-test',
  templateUrl: './back-test.component.html',
  styleUrls: ['./back-test.component.scss']
})
export class BackTestComponent implements OnInit {
  private subscription = new Subscription();
  public options: FormGroup;
  public percentageChangeControl = new FormControl(-25, Validators.max(-10));
  public tickerControl = new FormControl();
  public lookBackPeriodControl = new FormControl(90);
  public formSubmitted = null;
  // TODO: fix type
  public results: any[];

  constructor(
    formBuilder: FormBuilder,
    private historicalsClientService: HistoricalsClientService,
    private backTestService: BackTestService
  ) {
    this.options = formBuilder.group({
      period: this.lookBackPeriodControl,
      span: this.percentageChangeControl,
      ticker: this.tickerControl,
    });
  }

  ngOnInit(): void { }

  test() {
    this.subscription.unsubscribe();
    console.log('testing', this.tickerControl.value);
    if (this.tickerControl.value) {
      this.formSubmitted = true;
      this.subscription = this.historicalsClientService.get(this.tickerControl.value.toUpperCase(), 'daily')
        .subscribe((response) => {
          this.results = this.backTestService.by3Month(
            response,
            this.lookBackPeriodControl.value,
            this.percentageChangeControl.value / 100,
          );
        });
    }
  }
}
