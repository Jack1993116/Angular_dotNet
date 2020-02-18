import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandsGridComponent } from './demands-grid.component';

describe('DemandsGridComponent', () => {
  let component: DemandsGridComponent;
  let fixture: ComponentFixture<DemandsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
