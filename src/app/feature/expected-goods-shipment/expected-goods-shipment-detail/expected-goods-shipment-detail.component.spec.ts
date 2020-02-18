import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedGoodsShipmentDetailComponent } from './expected-goods-shipment-detail.component';

describe('ExpectedGoodsShipmentDetailComponent', () => {
  let component: ExpectedGoodsShipmentDetailComponent;
  let fixture: ComponentFixture<ExpectedGoodsShipmentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpectedGoodsShipmentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectedGoodsShipmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
