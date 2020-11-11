import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CoursesPage } from './courses.page';

describe('CoursesPage', () => {
  let component: CoursesPage;
  let fixture: ComponentFixture<CoursesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesPage ],
      imports: [IonicModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create courses page', () => {
    expect(component).toBeTruthy();
  });
});
