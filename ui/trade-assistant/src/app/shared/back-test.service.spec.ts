import { TestBed } from '@angular/core/testing';
import { BackTestService } from './back-test.service';
import { backTestTestData, backTestTestResult } from './back-test.service.test-data';

describe('BackTestService', () => {
  let service: BackTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle splits', () => {
    const results = service.run(backTestTestData, 90, -0.25);
    console.log(results);
    expect(results).toEqual(backTestTestResult);
  });
});
