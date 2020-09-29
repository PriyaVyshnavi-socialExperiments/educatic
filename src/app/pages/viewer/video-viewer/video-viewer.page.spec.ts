import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VideoViewerPage } from './video-viewer.page';

describe('VideoViewerPage', () => {
  let component: VideoViewerPage;
  let fixture: ComponentFixture<VideoViewerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoViewerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VideoViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
