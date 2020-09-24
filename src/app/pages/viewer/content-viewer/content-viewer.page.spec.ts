import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContentViewerPage } from './content-viewer.page';

describe('ContentViewerPage', () => {
  let component: ContentViewerPage;
  let fixture: ComponentFixture<ContentViewerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentViewerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContentViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
