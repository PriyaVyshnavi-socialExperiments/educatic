import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AttendanceService } from './attendance.service';
import { BlobUploadsViewStateService } from '../azure-blob/blob-uploads-view-state.service';
import { BlobSharedViewStateService } from '../azure-blob/blob-shared-view-state.service';

describe('AttendanceService', () => {
  let service: AttendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [
        {provide: BlobUploadsViewStateService, useValue: null},
        {provide: BlobSharedViewStateService, useValue: null},
      ]
    });
    service = TestBed.inject(AttendanceService);
  });

  it('should be created attendance service', () => {
    expect(service).toBeTruthy();
  });
});
