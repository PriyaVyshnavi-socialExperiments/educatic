import { TestBed } from '@angular/core/testing';

import { OfflineWebsitesService } from './offline-websites.service';

describe('OfflineWebsitesService', () => {
  let service: OfflineWebsitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineWebsitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
