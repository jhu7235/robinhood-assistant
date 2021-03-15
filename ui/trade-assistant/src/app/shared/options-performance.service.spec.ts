import { TestBed } from '@angular/core/testing';

import { OptionsPerformanceService } from './options-performance.service';

describe('OptionsPerformanceService', () => {
  let service: OptionsPerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptionsPerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
