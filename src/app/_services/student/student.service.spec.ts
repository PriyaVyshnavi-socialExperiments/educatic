import { TestBed } from '@angular/core/testing';

import { StudentService } from './student.service';
import { HttpClientModule } from '@angular/common/http';
import { BlobUploadsViewStateService } from '../azure-blob/blob-uploads-view-state.service';
import { BlobSharedViewStateService } from '../azure-blob/blob-shared-view-state.service';

describe('StudentService', () => {
  let service: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [
        {provide: BlobUploadsViewStateService, useValue: null},
        {provide: BlobSharedViewStateService, useValue: null},
      ]
    });
    service = TestBed.inject(StudentService);
  });

  it('should be created student service', () => {
    expect(service).toBeTruthy();
  });
});
