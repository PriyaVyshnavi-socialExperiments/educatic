import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssignmentListPage } from './assignment-list.page';

describe('AssignmentListPage', () => {
  let component: AssignmentListPage;
  let fixture: ComponentFixture<AssignmentListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignmentListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
