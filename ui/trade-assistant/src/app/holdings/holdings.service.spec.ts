import { TestBed } from '@angular/core/testing';

import { HoldingsService } from './holdings.service';

describe('HoldingsService', () => {
  let service: HoldingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoldingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
