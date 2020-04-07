import { TestBed } from '@angular/core/testing';

import { OrdersClientService } from './orders-client.service';

describe('OrdersClientService', () => {
  let service: OrdersClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdersClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
