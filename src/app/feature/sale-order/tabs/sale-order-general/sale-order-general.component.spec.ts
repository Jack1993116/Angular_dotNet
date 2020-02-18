import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderGeneralComponent } from './sale-order-general.component';

describe('SaleOrderGeneralComponent', () => {
  let component: SaleOrderGeneralComponent;
  let fixture: ComponentFixture<SaleOrderGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleOrderGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleOrderGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
