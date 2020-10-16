import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubjectAssignmentsPage } from './subject-assignments.page';

describe('SubjectAssignmentsPage', () => {
  let component: SubjectAssignmentsPage;
  let fixture: ComponentFixture<SubjectAssignmentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectAssignmentsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubjectAssignmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
