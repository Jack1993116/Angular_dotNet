import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedGoodsShipmentGeneralComponent } from './expected-goods-shipment-general.component';

describe('ExpectedGoodsShipmentGeneralComponent', () => {
  let component: ExpectedGoodsShipmentGeneralComponent;
  let fixture: ComponentFixture<ExpectedGoodsShipmentGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpectedGoodsShipmentGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectedGoodsShipmentGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
