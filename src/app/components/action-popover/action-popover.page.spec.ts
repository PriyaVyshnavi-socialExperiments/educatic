import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavParams } from '@ionic/angular';
import { NavParamsMock } from 'ionic-mocks';

import { ActionPopoverPage } from './action-popover.page';

describe('ActionPopoverPage', () => {
  let component: ActionPopoverPage;
  let fixture: ComponentFixture<ActionPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionPopoverPage ],
      imports: [IonicModule],
      providers: [
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActionPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
