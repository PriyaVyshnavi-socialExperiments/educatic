import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImageEditViewerPage } from './image-edit-viewer.page';

describe('ImageEditViewerPage', () => {
  let component: ImageEditViewerPage;
  let fixture: ComponentFixture<ImageEditViewerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageEditViewerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageEditViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
