import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormButtonRowComponent } from './form-button-row.component';

describe('FormButtonRowComponent', () => {
  let component: FormButtonRowComponent;
  let fixture: ComponentFixture<FormButtonRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormButtonRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormButtonRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
