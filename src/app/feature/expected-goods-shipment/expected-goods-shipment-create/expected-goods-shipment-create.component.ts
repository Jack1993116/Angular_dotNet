import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { BaseEditCreate } from 'app/feature/base-components/classes/base-edit-create';
import { ExpectedGoodsShipment, ExpectedGoodsShipmentLines } from '../ExpectedGoodsShipment';
import { ExpectedGoodsShipmentService } from '../expected-goods-shipment-service';
import { SaleOrder } from 'app/feature/sale-order/SaleOrder';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';


@Component({
  selector: 'app-expected-goods-shipment-create',
  templateUrl: './expected-goods-shipment-create.component.html',
  styleUrls: ['./expected-goods-shipment-create.component.scss']
})
export class ExpectedGoodsShipmentCreateComponent 
  extends BaseEditCreate<ExpectedGoodsShipment, ExpectedGoodsShipmentService>
  implements OnInit {

  
  constructor(public expectedGoodsShipmentService: ExpectedGoodsShipmentService,
              public router: Router,
              public route: ActivatedRoute,
              public snacBar: MatSnackBar,
              public translateService: TranslateService,
              private erpLogisticSiteService: ERPLogisticSiteService) { 
    super(expectedGoodsShipmentService,
        router, route, snacBar, translateService,
        'EGS_CREATE',
        '/expected-goods-shipment');         
  }

  ngOnInit(): void {
    const saleOrder: SaleOrder = window.history.state.saleOrder;
    if (saleOrder) {
      this.assignSaleOrderToExpectedGoodsShipment(saleOrder);
      this.assignSaleOrderLinesToExpectedGoodsShipmentLines(saleOrder);
    } else { 
      this.entity = new ExpectedGoodsShipment();
      this.entity.expShipStID = 1;
      const checkedERP = this.erpLogisticSiteService
        .getCheckedERP();
      if (checkedERP.length === 1) {
        this.entity.erpCompanyID = checkedERP[0].erpCompanyID;
      }
      const checkedLogisticSite = this.erpLogisticSiteService
        .getCheckedLogisticSites();
      if (checkedLogisticSite.length === 1) {
        this.entity.logisticSiteCode = 
          checkedLogisticSite[0].logisticSiteCode;
      }
      this.entity.lines = [];
    }
  }

  private assignSaleOrderLinesToExpectedGoodsShipmentLines(
    saleOrder: SaleOrder): void {
    saleOrder.lines.forEach(line => {
      if (line.quantity > line.releasedQty) {
        this.entity.lines.push(Object.assign(new ExpectedGoodsShipmentLines(), {
          baseObjType: line.objType,
          baseDocID: line.docID,
          baseDocNum: saleOrder.docNum,
          baseLineID: line.lineID,
          bpDocNum: saleOrder.bpDocNum,
          itemID: line.itemID,
          itemCode: line.itemCode,
          logisticSiteCode: line.logisticSiteCode,
          itemName: line.itemName,
          frgnName: line.itemFrgnName,
          baseQty: line.quantity,
          ExpShipStID: 1,
          lineStatusCode: 'P',
          ShipItemUnitID: line.shipItemUnitID,
          allowPartialUOM: line.allowPartialUOM,
          allowPartialShip: false
        }));
      }
    });
  }

  private assignSaleOrderToExpectedGoodsShipment(
    saleOrder: SaleOrder): void {
    this.entity = Object.assign(new ExpectedGoodsShipment(), {
      seriesID: 3,
      // createDate: Date.now(),
      bpCode: saleOrder.bpCode,
      bpName: saleOrder.bpName,
      bpDocNum: saleOrder.bpDocNum,
      erpDocNum: saleOrder.erpDocNum,
      erpCompanyID: saleOrder.erpCompanyID,
      ExpShipStID: 1,
      docStatusCode: 'P'
    });
    this.entity.lines = [];
  }

  save(event: ExpectedGoodsShipment): void {
    const actionToTake = event.docID ? 'edit' : 'create';

    this.logisticSiteVerification(event);
    super.save(event, 
      'EGS_CREATED', 'docNum', actionToTake,
      null, event.logisticSiteCode);
  }

  postAndWO(event: ExpectedGoodsShipment): void {
    this.logisticSiteVerification(event);
    this.isSaving = true;
    
    const actionObservablue = this.expectedGoodsShipmentService
      .createItem(event, null, 
        event.logisticSiteCode, true);
    this.handleEntityUpdateCallBack(actionObservablue,
      'docNum', 'EGS_CREATED');
  }

  private logisticSiteVerification(event: ExpectedGoodsShipment): void {
    if (!event.logisticSiteCode) {
      event.logisticSiteCode =
        this.erpLogisticSiteService
          .getCheckedLogisticSites()[0].logisticSiteCode;
    }
  }
}
