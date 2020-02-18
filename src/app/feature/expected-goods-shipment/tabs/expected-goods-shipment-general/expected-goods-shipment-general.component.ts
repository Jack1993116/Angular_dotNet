import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material';

import { ExpectedGoodsShipment, ExpectedGoodsShipmentLines, CompatibleLine } from '../../ExpectedGoodsShipment';
import { ExpectedGoodsShipmentService } from '../../expected-goods-shipment-service';
import { LinesDialogComponent } from 'app/shared/components/lines-dialog/lines-dialog.component';
import { EntityApi } from 'app/shared/interfaces';
import { SearchItems } from 'app/feature/base-components/abstract-classes/search-items';
import { ItemMasterDataService } from 'app/feature/item-master-data/item-master-data.service';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';

@Component({
  selector: 'app-expected-goods-shipment-general',
  templateUrl: './expected-goods-shipment-general.component.html',
  styleUrls: ['./expected-goods-shipment-general.component.scss']
})
export class ExpectedGoodsShipmentGeneralComponent 
  extends SearchItems 
  implements OnInit {

  @Input()
  expectedGoodsShipment: ExpectedGoodsShipment;
  logisticSites: string[] = [];

  @ViewChild('itemCodeSelectEle', { static: false } ) itemCodeSelect;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  public displayedColumns: string[] = ['lineSeq', 'erpDocNum',
    'bpDocNum', 'itemCode', 'itemName', 'frgnName', 'baseQty',
    'allocated', 'onPlanning', 'onOrder', 'expRctQty', 'confDueDate',
    'lineStatusCode', 'createDate', 'updateDate', 'revisionCode',
    'allowPartialShip', 'allowPartialUOM', 'allocPriority', 'overwritePriority'
  ];

  public inputAutoColumns: string[] = ['bpDocNum',
    'itemCode', 'itemName', 'frgnName', 'baseQty', 'revisionCode'];
  public AutoColumns: string[] = ['lineSeq', 'erpDocNum',
    'allocated', 'onPlanning', 'onOrder', 'expRctQty', ];
  public manualColumns: string[] = ['lineStatusCode', 'expShipStID'];
  public AutoDatesColumns: string[] = ['confDueDate', 'createDate', 
    'updateDate'];
  public AutoBoolColumns: string[] = ['allowPartialShip', 
    'allowPartialUOM', 'allocPriority', 'overwritePriority'];

  constructor(private expectedGoodsService: ExpectedGoodsShipmentService,
              private dialog: MatDialog,
              public itemMasterDataService: ItemMasterDataService,
              private erpLogisticSiteService: ERPLogisticSiteService) {
   super(itemMasterDataService);
   this.logisticSites = this.erpLogisticSiteService
                .getCheckedLogisticSiteCodes();
  }


  ngOnInit(): void {
    this.wireUpSearch();
  }

  wireUpSearch(): void {
    super.wireUpSearchItems();
  }

  searchItems(term: string): void {
    this.searchTermItems.next(term);
  }

  selectItem(event: MatSelectChange, row: ExpectedGoodsShipmentLines): void {
    row.itemID = event.value['itemID'];
    row.itemCode = event.value['itemCode'];
    row.itemName = event.value['itemName'];
  }



  create(event: any): void {
    this.getExpectedGoodsDraftShipment(); 
  }

  private getExpectedGoodsDraftShipment(): void {
    const linesSubscription = 
      this.expectedGoodsService.getExpectedShipmentDraftLines();
    this.openDialog(linesSubscription).subscribe(result => {
      if ( !result )
      {
        return;
      }
      if (result[0] === true) {
        const linesToAdd = result[1].selected as CompatibleLine[];
        linesToAdd.forEach(line => {
          this.expectedGoodsShipment.lines.push(Object.assign(
            new ExpectedGoodsShipmentLines(), {
              objType: line.objType,
              baseDocNum: line.docNum,
              baseLineID: line.lineId,
              baseDocID: line.docId,
              itemID: line.itemID,
              itemCode: line.itemCode,
              itemName: line.itemName,
              frgnName: line.itemFrgnName,
              baseQty: line.openQuantity
          }));
        });
      }
      this.table.renderRows();
    });
  }

  openDialog(lines: Observable<EntityApi<CompatibleLine>>): Observable<any> {
    const dialogRef = this.dialog.open(LinesDialogComponent, {
      panelClass: 'lines-dialog',
      data: {
        dialogTitle: 'Add Expected Goods Lines',
        displayedColumns: [
          'select', 'objType', 'docID', 'lineID', 'docNum', 
          'itemID', 'itemCode', 'itemName', 'itemFrgnName',
          'openQuantity'
        ],
        lines: lines
      }
    });

    return dialogRef.afterClosed();
  }

  
}
