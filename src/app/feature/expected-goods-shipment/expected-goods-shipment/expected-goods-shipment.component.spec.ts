import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedGoodsShipmentComponent } from './expected-goods-shipment.component';

describe('ExpectedGoodsShipmentComponent', () => {
  let component: ExpectedGoodsShipmentComponent;
  let fixture: ComponentFixture<ExpectedGoodsShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpectedGoodsShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectedGoodsShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
