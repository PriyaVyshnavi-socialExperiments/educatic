import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SigninComponent } from './signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SigninComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatInputModule,
        RouterTestingModule.withRoutes([]),
        IonicModule],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
