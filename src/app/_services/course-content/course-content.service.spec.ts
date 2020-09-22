import { TestBed } from '@angular/core/testing';

import { CourseContentService } from './course-content.service';

describe('CourseContentService', () => {
  let service: CourseContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
