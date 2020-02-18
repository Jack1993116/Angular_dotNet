import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ItemMasterData, ItemLogisticSite, ItemSettings } from '../../ItemMasterData';
import { UnitOfMeasureService } from 'app/core/services/unit-of-measure/unit-of-measure.service';
import { UnitOfMeasure } from 'app/core/services/unit-of-measure/UnitOfMeasure';

@Component({
  selector: 'app-item-logistic-site',
  templateUrl: './item-logistic-site.component.html',
  styleUrls: ['./item-logistic-site.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItemLogisticSiteComponent implements OnInit {

  @Input()
  item: ItemMasterData;
  @Input()
  form: FormGroup;
  unitOfMeasure: UnitOfMeasure[];
  public itemLogisticSettings: ItemLogisticSite[] = [];
  public displayedColumns: string[] = ['logisticSiteCode', 'defReceiveUnitCode', 'batchManaged', 'revisionManaged'];

  constructor(unitOfMeasureService: UnitOfMeasureService) { 
    // this.unitOfMeasure = unitOfMeasureService.
    //   getUnitOfMeasure().slice(0);
  }

  ngOnInit(): void {
    const keys = Object.keys(this.item['itemLogisticSites']);
    keys.forEach(element => {
      const itemSetLog = this.item['itemLogisticSites'][element];
      const itemSett = itemSetLog['wmsItemSetting'];
      this.itemLogisticSettings.push(Object.assign(new ItemLogisticSite(), {
        itemLgID: itemSetLog.itemLgID,
        logisticSiteCode: element,
        itemSetting: Object.assign(new ItemSettings(), {
          defReceiveUnitCode:  itemSett.defReceiveUnitCode,
          receivingStatusID: itemSett.receivingStatusID,
          batchManaged: itemSett.batchManaged,
          revisionManaged: itemSett.revisionManaged,
          prodDepID: itemSett.prodDepID
        })
      }));
    });
  }

}
