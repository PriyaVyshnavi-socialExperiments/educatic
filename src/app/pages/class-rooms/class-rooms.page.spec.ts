import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClassRoomsPage } from './class-rooms.page';

describe('ClassRoomsPage', () => {
  let component: ClassRoomsPage;
  let fixture: ComponentFixture<ClassRoomsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassRoomsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClassRoomsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
