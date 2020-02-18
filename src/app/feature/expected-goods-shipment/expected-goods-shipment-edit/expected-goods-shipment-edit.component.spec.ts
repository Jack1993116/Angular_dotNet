import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedGoodsShipmentEditComponent } from './expected-goods-shipment-edit.component';

describe('ExpectedGoodsShipmentEditComponent', () => {
  let component: ExpectedGoodsShipmentEditComponent;
  let fixture: ComponentFixture<ExpectedGoodsShipmentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpectedGoodsShipmentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectedGoodsShipmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
