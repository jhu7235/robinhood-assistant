import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchStockTableComponent } from './watch-stock-table.component';

describe('WatchStockTableComponent', () => {
  let component: WatchStockTableComponent;
  let fixture: ComponentFixture<WatchStockTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchStockTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchStockTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
