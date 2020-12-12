import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrainCognitiveServicePage } from './train-cognitive-service.page';

describe('TrainCognitiveServicePage', () => {
  let component: TrainCognitiveServicePage;
  let fixture: ComponentFixture<TrainCognitiveServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainCognitiveServicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainCognitiveServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
