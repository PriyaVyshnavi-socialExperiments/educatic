import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TeacherAddPage } from './teacher-add.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('TeacherAddPage', () => {
  let component: TeacherAddPage;
  let fixture: ComponentFixture<TeacherAddPage>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule,
        IonicModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create teacher add page', () => {
    expect(component).toBeTruthy();
  });
});
