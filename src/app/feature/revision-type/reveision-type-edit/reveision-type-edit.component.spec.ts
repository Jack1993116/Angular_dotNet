import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReveisionTypeEditComponent } from './reveision-type-edit.component';

describe('ReveisionTypeEditComponent', () => {
  let component: ReveisionTypeEditComponent;
  let fixture: ComponentFixture<ReveisionTypeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReveisionTypeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReveisionTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
