import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StudentPhotoUploadPage } from './student-photo-upload.page';

describe('StudentPhotoUploadPage', () => {
  let component: StudentPhotoUploadPage;
  let fixture: ComponentFixture<StudentPhotoUploadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentPhotoUploadPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentPhotoUploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
