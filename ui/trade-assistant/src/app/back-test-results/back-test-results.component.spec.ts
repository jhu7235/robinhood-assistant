import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackTestResultsComponent } from './back-test-results.component';

describe('BackTestResultsComponent', () => {
  let component: BackTestResultsComponent;
  let fixture: ComponentFixture<BackTestResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackTestResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackTestResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
