import { TestBed } from '@angular/core/testing';

import { SchoolService } from './school.service';
import { HttpClientModule } from '@angular/common/http';

describe('SchoolService', () => {
  let service: SchoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: []
    });
    service = TestBed.inject(SchoolService);
  });

  it('should be created school service', () => {
    expect(service).toBeTruthy();
  });
});
