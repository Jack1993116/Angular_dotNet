import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinesDialogComponent } from './lines-dialog.component';

describe('LinesDialogComponent', () => {
  let component: LinesDialogComponent;
  let fixture: ComponentFixture<LinesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
