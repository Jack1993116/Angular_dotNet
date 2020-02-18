import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReveisionTypeCreateComponent } from './reveision-type-create.component';

describe('ReveisionTypeCreateComponent', () => {
  let component: ReveisionTypeCreateComponent;
  let fixture: ComponentFixture<ReveisionTypeCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReveisionTypeCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReveisionTypeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
