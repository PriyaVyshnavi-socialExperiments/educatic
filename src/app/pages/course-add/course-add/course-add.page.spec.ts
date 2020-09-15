import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CourseAddPage } from './course-add.page';

describe('CourseAddPage', () => {
  let component: CourseAddPage;
  let fixture: ComponentFixture<CourseAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseAddPage ],
      imports: [IonicModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create course add page', () => {
    expect(component).toBeTruthy();
  });
});
