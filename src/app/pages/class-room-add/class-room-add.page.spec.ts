import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClassRoomAddPage } from './class-room-add.page';
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

describe('ClassRoomAddPage', () => {
  let component: ClassRoomAddPage;
  let fixture: ComponentFixture<ClassRoomAddPage>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ ClassRoomAddPage ],
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
        IonicModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassRoomAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create class room add page', () => {
    expect(component).toBeTruthy();
  });
});
