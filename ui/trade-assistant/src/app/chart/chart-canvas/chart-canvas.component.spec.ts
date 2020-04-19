import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartCanvasComponent } from './chart-canvas.component';

describe('ChartCanvasComponent', () => {
  let component: ChartCanvasComponent;
  let fixture: ComponentFixture<ChartCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChartCanvasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
