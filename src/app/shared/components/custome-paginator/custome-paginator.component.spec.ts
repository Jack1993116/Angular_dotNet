import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomePaginatorComponent } from './custome-paginator.component';

describe('CustomePaginatorComponent', () => {
  let component: CustomePaginatorComponent;
  let fixture: ComponentFixture<CustomePaginatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomePaginatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomePaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
