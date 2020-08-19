import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StudentAddPage } from './student-add.page';

describe('StudentAddPage', () => {
  let component: StudentAddPage;
  let fixture: ComponentFixture<StudentAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
