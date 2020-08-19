import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClassRoomAddPage } from './class-room-add.page';

describe('ClassRoomAddPage', () => {
  let component: ClassRoomAddPage;
  let fixture: ComponentFixture<ClassRoomAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassRoomAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClassRoomAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
