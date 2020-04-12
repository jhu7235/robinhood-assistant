import { TestBed } from '@angular/core/testing';

import { HistoricalsClientService } from './historicals-client.service';

describe('HistoricalsService', () => {
  let service: HistoricalsClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricalsClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
