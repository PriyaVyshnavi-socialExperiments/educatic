import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StudentAddPage } from './student-add.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BlobUploadsViewStateService } from 'src/app/_services/azure-blob/blob-uploads-view-state.service';
import { StudentService } from 'src/app/_services/student/student.service';
import { ClassRoomService } from 'src/app/_services/class-room/class-room.service';
import { DataShareService } from 'src/app/_services/data-share.service';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';
import { BLOB_STORAGE_TOKEN } from 'src/app/_services/azure-blob/token';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('StudentAddPage', () => {
  let component: StudentAddPage;
  let fixture: ComponentFixture<StudentAddPage>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [StudentAddPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        IonicModule.forRoot()],
      providers: [
        StudentService,
        ClassRoomService,
        DataShareService,
        { provide: AuthenticationService, useValue: () => null },
        { provide: BlobUploadsViewStateService, useValue: null },
        { provide: BlobUploadsViewStateService, useValue: null },
        { provide: BLOB_STORAGE_TOKEN, useValue: undefined }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create student add page', () => {
    expect(component).toBeTruthy();
  });
});
