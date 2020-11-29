import { TestBed } from '@angular/core/testing';

import { OptionsClientService } from './options-client.service';

describe('OptionsClientService', () => {
  let service: OptionsClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptionsClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
