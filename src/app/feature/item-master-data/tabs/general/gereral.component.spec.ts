import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GereralComponent } from './imd-general.component';

describe('GereralComponent', () => {
  let component: GereralComponent;
  let fixture: ComponentFixture<GereralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GereralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GereralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
