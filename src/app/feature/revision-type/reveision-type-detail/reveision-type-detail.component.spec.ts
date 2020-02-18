import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReveisionTypeDetailComponent } from './reveision-type-detail.component';

describe('ReveisionTypeDetailComponent', () => {
  let component: ReveisionTypeDetailComponent;
  let fixture: ComponentFixture<ReveisionTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReveisionTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReveisionTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
