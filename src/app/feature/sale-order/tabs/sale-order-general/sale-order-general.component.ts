import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { SaleOrder, SaleOrderLines } from '../../SaleOrder';
import { LinesDialogComponent } from 'app/shared/components/lines-dialog/lines-dialog.component';
import { ExpectedGoodsShipmentLines } from 'app/feature/expected-goods-shipment/ExpectedGoodsShipment';
import { ExpectedGoodsShipmentService } from 'app/feature/expected-goods-shipment/expected-goods-shipment-service';
import { EntityApi } from 'app/shared/interfaces';
import { ItemMasterData } from 'app/feature/item-master-data/ItemMasterData';
import { PriceListService } from 'app/core/services/price-list/price-list.service';
import { SaleOrderService, Attributes } from '../../sale-order.service';
import { AttributesFormBuilderService } from 'app/core/services/attributes/attributes-form-builder.service';

@Component({
  selector: 'app-sale-order-general',
  templateUrl: './sale-order-general.component.html',
  styleUrls: ['./sale-order-general.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SaleOrderGeneralComponent 
  implements OnInit {

  @Input()
  saleOrder: SaleOrder;
  @Input()
  erpCompanyId: number;
  @Input()
  bpCode: number;
  
  @Input()
  form: FormGroup;

  public displayedColumns: string[] = ['expand', 'lineSeq',
    'logisticSiteCode', 'itemCode', 'itemName', 'frgnName',
    'unitCode', 'quantity', 'price', 'priceRatio',
    'curCode', 'discount', 'frgnLineTotal', 'releasedQty', 
    'openQty', 'shipQty', 'lineStatusCode', 'createDate', 
    'updateDate', 'revisionCode', 'projectCode', 'allowPartialUOM', 'delete'];
    
  attributes: Attributes[] = [];

  expandedElement: SaleOrderLines | null;

  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  selectedItemEvent: ItemMasterData;
  
  constructor(private router: Router,
              private dialog: MatDialog,
              private expectedGoodsShipmentService: ExpectedGoodsShipmentService,
              private priceListService: PriceListService,
              private saleOrderService: SaleOrderService,
              private attributesFormBuilderService: AttributesFormBuilderService<SaleOrderLines>) { 
  }

  ngOnInit(): void {
    this.getAttributes();
  }

  private getAttributes(): void {
    const deleteColumn = this.displayedColumns.pop();
    this.saleOrderService.getLineAttributes(this.erpCompanyId)
      .subscribe(data => {
        this.attributes = data;
        this.attributes.forEach(attribute => {
          this.displayedColumns.push(attribute.name);
          this.attributesFormBuilderService
            .addTranslationForAttribute(attribute);
        });
        this.displayedColumns.push(deleteColumn); 
      });
  }

  dictonaryLen(obj: any): number {
    return Object.keys(obj).length;
  }

  updateConnectedField(input: string, id: number,
                       line: SaleOrderLines): void {
    const WidthMultiSectionRatio = 92;
    const HeightMultiSectionRatio = 122.5;
    const Width = 4;
    const Height = 5;
    const mrSize = 9;
    const WidthMultiSection = 10;
    const HeightMultiSection = 11;
    const Sections = 12;
    const mrSizeSection = 13;

    if (id === Width || id === Height) {
      line.attributes[mrSize] = (line.attributes[Width] / 100) *
        (line.attributes[Height] / 100);

      if (line.attributes[Width] > WidthMultiSectionRatio) {
        line.attributes[WidthMultiSection] = 
          Math.ceil(line.attributes[Width] / 
            WidthMultiSectionRatio);
      } else {
        line.attributes[WidthMultiSection] = 1;
      }

      if (line.attributes[Height] > HeightMultiSectionRatio) {
        line.attributes[HeightMultiSection] = 
          Math.ceil(line.attributes[Height] / 
            HeightMultiSectionRatio);
      } else {
        line.attributes[HeightMultiSection] = 1;
      }

      line.attributes[Sections] = 
        line.attributes[HeightMultiSection] *
          line.attributes[WidthMultiSection];
      
      line.attributes[mrSizeSection] = 
        line.attributes[mrSize] /
          line.attributes[Sections];
    }
  }

  create(event: any): void {
    this.saleOrder.lines.push(Object.assign(new SaleOrderLines(), {
      lineStatusCode: 'P',
      priceRatio: 1,
      discount: 0,
      attributes: {},
      unitCodes: []
    }));
    this.table.renderRows();
  }

  delete(line: SaleOrderLines): void {
    const lineIndex = this.saleOrder.lines.indexOf(line, 0);
    if (lineIndex > -1) {
      this.saleOrder.lines.splice(lineIndex, 1);
      this.table.renderRows();
    }
  }

  releaseQty(line: SaleOrderLines): void {
    const lines: ExpectedGoodsShipmentLines[] = [];
    const linesSubscription = 
      this.getUnchangedAndDraftReleasedLinesForSaleOrder(line, lines);
    
    this.openDialog(linesSubscription).subscribe(result => {
      if ( !result )
      {
        return;
      }
      if (result[0] === true) { // Save
        const linesToUpdate: ExpectedGoodsShipmentLines[] = 
          this.getChangedLines(lines, result);
        
        if (linesToUpdate.length > 0) {
          this.updateLineFromExpectedLinesAllocation(linesToUpdate, line);
        }
      } else {
        if (result[1] === true) { // Create
          const saleOrderToCreateExpectedGoods = Object.assign(
            new SaleOrder(), this.saleOrder );
          saleOrderToCreateExpectedGoods.lines = [];
          saleOrderToCreateExpectedGoods.lines.push(line);
          this.router.navigate(['/expected-goods-shipment/create'], {
            state: { saleOrder: saleOrderToCreateExpectedGoods }});
        }
      }
    });
  }

  private updateLineFromExpectedLinesAllocation(
    linesToUpdate: ExpectedGoodsShipmentLines[], 
    line: SaleOrderLines): void {
    this.expectedGoodsShipmentService
      .updateSaleOrderLineByExpectedGoodsLines(linesToUpdate)
      .subscribe(data => {
        const index = this.saleOrder.lines.indexOf(line, 0);
        if (index > -1) {
          this.saleOrder.lines[index] = data;
        }
        this.table.renderRows();
      });
  }

  private getChangedLines(lines: ExpectedGoodsShipmentLines[], result: boolean)
  : ExpectedGoodsShipmentLines[] {
    const linesToUpdate: ExpectedGoodsShipmentLines[] = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].allocated !== result[1][i].allocated) {
        linesToUpdate.push(result[1][i] as ExpectedGoodsShipmentLines);
      }
    }
    return linesToUpdate;
  }

  private getUnchangedAndDraftReleasedLinesForSaleOrder(
    line: SaleOrderLines,
    lines: ExpectedGoodsShipmentLines[])
    : Observable<EntityApi<ExpectedGoodsShipmentLines>> {
    return this.expectedGoodsShipmentService.getBySaleOrderLine
      (line.lineID, line.logisticSiteCode).pipe(
        tap(data => {
          data.items.forEach(element => {
            lines.push(Object.assign(new ExpectedGoodsShipmentLines(), element));
          });
        })
    );
  }

  private openDialog(lines: Observable<EntityApi<ExpectedGoodsShipmentLines>>)
  : Observable<any> {
    const dialogRef = this.dialog.open(LinesDialogComponent, {
      panelClass: 'lines-dialog',
      data: {
        dialogTitle: 'Release Quantity',
        displayedColumns: [
          'objType', 'lineSeq', 'baseDocNum', 'confDueDate', 
          'lineStatusCode', 'allocated'
        ],
        lines: lines
      }
    });

    return dialogRef.afterClosed();
  }

  itemChanged(event: [ItemMasterData, SaleOrderLines]): void {
    // if (event) {
    //   if (event[0]) {
    //     this.selectedItemEvent = event[0];
    //     this.priceListService.getPriceForItem(this.erpCompanyId,
    //       event[1].itemID, this.bpCode)
    //       .subscribe(data => {
    //         event[1].price = data.price;
    //         event[1].curCode = data.curCode;
    //       });
    //   }
    //   if (event[1]) { 
    //     event[1].shipItemUnitID = null;
    //     event[1].shipUnitCode = null;
    //     event[1].revisionCode = null;
    //   }
    //   // this.updatePriceList();
    // }
  }
}
