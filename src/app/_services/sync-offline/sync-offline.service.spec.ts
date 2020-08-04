import { TestBed } from '@angular/core/testing';

import { SyncOfflineService } from './sync-offline.service';

describe('SyncOfflineService', () => {
  let service: SyncOfflineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncOfflineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
