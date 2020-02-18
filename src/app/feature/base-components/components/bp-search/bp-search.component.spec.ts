import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpSearchComponent } from './bp-search.component';

describe('BpSearchComponent', () => {
  let component: BpSearchComponent;
  let fixture: ComponentFixture<BpSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
