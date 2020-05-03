import { TestBed } from '@angular/core/testing';

import { ListWatcherService } from './list-watcher.service';

describe('ListWatcherService', () => {
  let service: ListWatcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListWatcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
