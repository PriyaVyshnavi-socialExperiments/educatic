import { TestBed } from '@angular/core/testing';

import { OfflineService } from './offline.service';
import { HttpClientModule } from '@angular/common/http';

describe('OfflineService', () => {
  let service: OfflineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: []
    });
    service = TestBed.inject(OfflineService);
  });

  it('should be created offline service', () => {
    expect(service).toBeTruthy();
  });
});
