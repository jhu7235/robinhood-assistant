import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWatchStockDialogComponent } from './add-watch-stock-dialog.component';

describe('AddWatchStockDialogComponent', () => {
  let component: AddWatchStockDialogComponent;
  let fixture: ComponentFixture<AddWatchStockDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWatchStockDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWatchStockDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
