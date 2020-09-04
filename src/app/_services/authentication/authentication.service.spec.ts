import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { ApplicationInsightsService } from 'src/app/_helpers/application-insights';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [
        {provide: ApplicationInsightsService, useValue: null},
      ]
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created authentication service', () => {
    expect(service).toBeTruthy();
  });
});
