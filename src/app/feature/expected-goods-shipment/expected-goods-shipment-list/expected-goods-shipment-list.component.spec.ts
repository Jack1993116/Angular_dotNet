import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedGoodsShipmentListComponent } from './expected-goods-shipment-list.component';

describe('ExpectedGoodsShipmentListComponent', () => {
  let component: ExpectedGoodsShipmentListComponent;
  let fixture: ComponentFixture<ExpectedGoodsShipmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpectedGoodsShipmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectedGoodsShipmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
