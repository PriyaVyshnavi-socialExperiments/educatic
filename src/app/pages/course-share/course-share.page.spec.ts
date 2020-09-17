import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CourseSharePage } from './course-share.page';

describe('CourseSharePage', () => {
  let component: CourseSharePage;
  let fixture: ComponentFixture<CourseSharePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseSharePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseSharePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
