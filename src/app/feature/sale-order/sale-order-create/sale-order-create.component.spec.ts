import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderCreateComponent } from './sale-order-create.component';

describe('SaleOrderCreateComponent', () => {
  let component: SaleOrderCreateComponent;
  let fixture: ComponentFixture<SaleOrderCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleOrderCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleOrderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
