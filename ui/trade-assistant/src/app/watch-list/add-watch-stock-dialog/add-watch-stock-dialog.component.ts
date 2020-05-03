import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IWatchStock } from './watch-stock.type';
import { QuotesClientService } from 'src/app/shared/quotes-client.service';


@Component({
  selector: 'app-add-watch-stock-dialog',
  templateUrl: './add-watch-stock-dialog.component.html',
  styleUrls: ['./add-watch-stock-dialog.component.scss']
})
export class AddWatchStockDialogComponent implements OnInit {
  public addStockGroup: FormGroup;
  public priceControl = new FormControl();
  public tickerControl = new FormControl();
  public addInProgress = false;


  constructor(
    private firestore: AngularFirestore,
    formBuilder: FormBuilder,
    private quotesClientService: QuotesClientService,
    private dialogRef: MatDialogRef<AddWatchStockDialogComponent>
  ) {
    this.addStockGroup = formBuilder.group({
      price: this.priceControl,
      ticker: this.tickerControl,
    });

  }

  ngOnInit(): void {
  }

  async add() {
    this.addInProgress = true;
    const symbol = (this.tickerControl.value.toString() as string).toUpperCase();
    const price = this.priceControl.value;
    const quote = await this.quotesClientService.get(symbol).toPromise();
    if (quote) {
      this.firestore.collection<IWatchStock>('watchStocks').add({
        userEmail: 'jhu7235@gmail.com',
        symbol,
        price,
        createdAt: Date.now()
      });
      this.dialogRef.close();
    } else {
      this.tickerControl.setErrors({ notFound: true });
    }
    this.addInProgress = false;
  }
}
