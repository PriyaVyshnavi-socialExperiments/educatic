import { TestBed } from '@angular/core/testing';

import { TeacherService } from './teacher.service';
import { HttpClientModule } from '@angular/common/http';

describe('TeacherService', () => {
  let service: TeacherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: []
    });
    service = TestBed.inject(TeacherService);
  });

  it('should be created teacher service', () => {
    expect(service).toBeTruthy();
  });
});
