import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemRequirementsManagementComponent } from './system-requirements-management.component';

describe('SystemRequirementsManagementComponent', () => {
  let component: SystemRequirementsManagementComponent;
  let fixture: ComponentFixture<SystemRequirementsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemRequirementsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRequirementsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
