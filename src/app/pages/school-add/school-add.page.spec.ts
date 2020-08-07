import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SchoolAddPage } from './school-add.page';

describe('SchoolAddPage', () => {
  let component: SchoolAddPage;
  let fixture: ComponentFixture<SchoolAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
