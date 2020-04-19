import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TInterval } from '../shared/historicals-client.service';

@Component({
  selector: 'app-chart-controller',
  templateUrl: './chart-controller.component.html',
  styleUrls: ['./chart-controller.component.scss']
})
export class ChartControllerComponent implements OnInit {
  @Output() changed = new EventEmitter();
  public interval: TInterval;

  onValueChange(event: { value: TInterval }) {
    this.interval = event.value;
    this.changed.emit(event);
  }

  constructor() { }

  ngOnInit(): void {
    this.onValueChange({ value: 'monthly' });
  }
}
