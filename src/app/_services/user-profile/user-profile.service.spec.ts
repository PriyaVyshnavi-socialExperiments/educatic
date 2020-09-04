import { TestBed } from '@angular/core/testing';

import { UserProfileService } from './user-profile.service';
import { HttpClientModule } from '@angular/common/http';

describe('UserProfileService', () => {
  let service: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: []
    });
    service = TestBed.inject(UserProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
