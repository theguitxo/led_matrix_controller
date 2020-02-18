import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelPage } from './panel.page';

describe('PanelPage', () => {
  let component: PanelPage;
  let fixture: ComponentFixture<PanelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
