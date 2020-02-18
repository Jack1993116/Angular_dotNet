import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTabComponent } from './table-tab.component';

describe('TableTabComponent', () => {
  let component: TableTabComponent;
  let fixture: ComponentFixture<TableTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
