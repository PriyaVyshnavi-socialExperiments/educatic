import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SchoolAddPage } from './school-add.page';
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
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

describe('SchoolAddPage', () => {
  let component: SchoolAddPage;
  let fixture: ComponentFixture<SchoolAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolAddPage ],
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
        providers: [ { provide: AuthenticationService, useValue: () => null },]
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create school add page', () => {
    expect(component).toBeTruthy();
  });
});
