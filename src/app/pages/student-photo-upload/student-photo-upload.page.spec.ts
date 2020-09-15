import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, AlertController } from '@ionic/angular';

import { StudentPhotoUploadPage } from './student-photo-upload.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BLOB_STORAGE_TOKEN } from 'src/app/_services/azure-blob/token';
import { BlobUploadsViewStateService } from 'src/app/_services/azure-blob/blob-uploads-view-state.service';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AlertControllerMock } from 'ionic-mocks';

describe('StudentPhotoUploadPage', () => {
  let component: StudentPhotoUploadPage;
  let fixture: ComponentFixture<StudentPhotoUploadPage>;

  beforeEach((() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;

    TestBed.configureTestingModule({
      declarations: [StudentPhotoUploadPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        IonicModule],
      providers: [
        { provide: AlertController, useValue: AlertControllerMock },
        { provide: BlobUploadsViewStateService, useValue: null },
        { provide: BlobUploadsViewStateService, useValue: null },
        { provide: BLOB_STORAGE_TOKEN, useValue: undefined }]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentPhotoUploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create student photo upload page', () => {
    expect(component).toBeTruthy();
  });
});
