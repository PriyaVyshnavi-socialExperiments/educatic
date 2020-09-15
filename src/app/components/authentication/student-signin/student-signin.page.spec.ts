import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StudentSigninPage } from './student-signin.page';

describe('StudentSigninPage', () => {
  let component: StudentSigninPage;
  let fixture: ComponentFixture<StudentSigninPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentSigninPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentSigninPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
