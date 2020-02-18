import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridColumnsPickerComponent } from './grid-columns-picker.component';

describe('GridColumnsPickerComponent', () => {
  let component: GridColumnsPickerComponent;
  let fixture: ComponentFixture<GridColumnsPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridColumnsPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridColumnsPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
