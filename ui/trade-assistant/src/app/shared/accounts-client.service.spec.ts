import { TestBed } from '@angular/core/testing';

import { AccountsClientService } from './accounts-client.service';

describe('AccountsClientService', () => {
  let service: AccountsClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountsClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
