import { TestBed } from '@angular/core/testing';

import { ClassRoomService } from './class-room.service';
import { HttpClientModule } from '@angular/common/http';

describe('ClassRoomService', () => {
  let service: ClassRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: []
    });
    service = TestBed.inject(ClassRoomService);
  });

  it('should be created class room service', () => {
    expect(service).toBeTruthy();
  });
});
