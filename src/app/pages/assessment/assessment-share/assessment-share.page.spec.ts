import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssessmentSharePage } from './assessment-share.page';

describe('AssessmentSharePage', () => {
  let component: AssessmentSharePage;
  let fixture: ComponentFixture<AssessmentSharePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentSharePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentSharePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
