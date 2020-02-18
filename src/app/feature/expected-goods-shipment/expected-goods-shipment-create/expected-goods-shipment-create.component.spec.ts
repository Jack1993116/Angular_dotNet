import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedGoodsShipmentCreateComponent } from './expected-goods-shipment-create.component';

describe('ExpectedGoodsShipmentCreateComponent', () => {
  let component: ExpectedGoodsShipmentCreateComponent;
  let fixture: ComponentFixture<ExpectedGoodsShipmentCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpectedGoodsShipmentCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectedGoodsShipmentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
