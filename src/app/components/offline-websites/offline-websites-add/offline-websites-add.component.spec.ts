import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfflineWebsitesAddComponent } from './offline-websites-add.component';

describe('OfflineWebsitesAddComponent', () => {
  let component: OfflineWebsitesAddComponent;
  let fixture: ComponentFixture<OfflineWebsitesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineWebsitesAddComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfflineWebsitesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
