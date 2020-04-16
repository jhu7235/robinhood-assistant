import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentChartComponent } from './instrument-chart.component';

describe('InstrumentChartComponent', () => {
  let component: InstrumentChartComponent;
  let fixture: ComponentFixture<InstrumentChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstrumentChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
