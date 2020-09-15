import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfflineWebsitesPage } from './offline-websites.page';

describe('OfflineWebsitesPage', () => {
  let component: OfflineWebsitesPage;
  let fixture: ComponentFixture<OfflineWebsitesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineWebsitesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfflineWebsitesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
