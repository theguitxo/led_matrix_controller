import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesListPage } from './devices-list.page';

describe('DevicesListPage', () => {
  let component: DevicesListPage;
  let fixture: ComponentFixture<DevicesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicesListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
