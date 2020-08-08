import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TeacherAddPage } from './teacher-add.page';

describe('TeacherAddPage', () => {
  let component: TeacherAddPage;
  let fixture: ComponentFixture<TeacherAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
