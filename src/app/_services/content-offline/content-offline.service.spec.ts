import { TestBed } from '@angular/core/testing';

import { ContentOfflineService } from './content-offline.service';

describe('ContentOfflineService', () => {
  let service: ContentOfflineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentOfflineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
