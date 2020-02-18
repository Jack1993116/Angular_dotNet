import { Component, OnInit, Input, Injectable, ViewEncapsulation, OnChanges, SimpleChanges, AfterViewInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { LineUnitCode } from '../line-unit-code/LineUnitCode';
import { BOM, BOMNode } from './BOM';
import { ItemMasterDataService } from 'app/feature/item-master-data/item-master-data.service';
import { SearchItemsBom } from 'app/feature/base-components/abstract-classes/search-items-bom';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { ItemMasterData } from 'app/feature/item-master-data/ItemMasterData';
import { FormGroup } from '@angular/forms';


@Injectable()
export class BOMTreeDataBase {
  dataChange = new BehaviorSubject<BOMNode[]>([]);


  get data(): BOMNode[] { 
    return this.dataChange.value;
  }

  constructor() {
  }

  initialize(fatherNodeKey: [number, string], bom: BOM[]): void {
    const data = this.buildTree(fatherNodeKey, bom);

    data.sort((a, b) => 
      (a.lineSeq > b.lineSeq) ? 1 : ((a.lineSeq < b.lineSeq) ? -1 : 0 ));
    this.dataChange.next(data);
  }

  buildTree(fatherNodeKey: [number, string], bomArr: BOM[]): BOMNode[] {
    const BOMTree: BOMNode[] = [];
    
    bomArr.forEach(bomItem => {
      if (bomItem.parentItemUnitID === fatherNodeKey[0] &&
        bomItem.parentUnitCode === fatherNodeKey[1]) {
          
          bomItem.useSalePrice = bomItem.useSalePrice ? 
            bomItem.useSalePrice : 'N';
            
          const node: BOMNode = {
            lineBomID: bomItem.lineBomID,
            objType: bomItem.objType,
            lineUnitID: bomItem.lineUnitID,
            parentItemID: bomItem.parentItemID,
            parentItemCode: bomItem.parentItemCode,
            parentItemUnitID: bomItem.parentItemUnitID,
            parentUnitCode: bomItem.parentUnitCode,
            childItemID: bomItem.childItemID,
            childItemUnitID: bomItem.childItemUnitID,
            display: bomItem.display,
            lineSeq: bomItem.lineSeq,
            childItemCode: bomItem.childItemCode,
            childUnitCode: bomItem.childUnitCode,
            bomQty: bomItem.bomQty,
            bomToTopQty: bomItem.bomToTopQty,
            quantity: bomItem.quantity,
            baseQty: bomItem.baseQty,
            baseUnitCode: bomItem.baseUnitCode,
            include: bomItem.include,
            childRevisionCode: bomItem.childRevisionCode,
            children: this.buildTree(
              [bomItem.childItemUnitID, bomItem.childUnitCode], bomArr),
            delete: null,
            useSalePrice: bomItem.useSalePrice,
            bomCTID: bomItem.bomCTID,
            localLineTotal: bomItem.localLineTotal,
            sysLineTotal: bomItem.sysLineTotal,
            costPrice: bomItem.costPrice,
            costCurrency: bomItem.costCurrency,
            costTotal: bomItem.costTotal,
            localCostTotal: bomItem.localCostTotal,
            sysCostTotal: bomItem.sysCostTotal,
            uiUpdate: bomItem.uiUpdate,
            salePrice: bomItem.salePrice,
            discount: bomItem.discount,
            lineTotal: bomItem.lineTotal
          };
          node.children.sort((a, b) => 
            (a.lineSeq > b.lineSeq) ? 1 : ((a.lineSeq < b.lineSeq) ? -1 : 0 ));
          BOMTree.push(node);
        }
    });

    return BOMTree;
  }

}
@Component({
  selector: 'app-bom',
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [BOMTreeDataBase]
})
export class BOMComponent 
 extends SearchItemsBom
 implements OnInit {

  @Input()
  lineUnitCode: LineUnitCode;
  @Input()
  erpId: number;
  @Input()
  logisticSite: string;
  @Input()
  form: FormGroup;
  @Output()
  lineToUpdate = new EventEmitter<LineUnitCode>();
  formInvalid = false;
  dataSource: BOMNode[] = [];
  
  constructor(private treeDataBase: BOMTreeDataBase,
              public translateService: TranslateService,
              public itemMasterDataService: ItemMasterDataService) {
    super(itemMasterDataService);
    treeDataBase.dataChange.subscribe(data => {
      this.dataSource = data;
    });
   }
  
  ngOnInit(): void {
    this.erpCompanyId = this.erpId;
    this.logisticSiteCode = this.logisticSite;

    this.treeDataBase.initialize(
      [this.lineUnitCode.itemUnitID, this.lineUnitCode.unitCode] ,
      this.lineUnitCode.boms);

    this.wireUpSearch();
  }
  
  public wireUpSearch(): void {
    super.wireUpSearchItems();
  }

  trans(value: string): string {
    return this.translateService.instant(value);
  }

  setBoms(boms: BOM[]): void { 
    if (boms && boms.length) {
      this.lineUnitCode.boms = boms;
      this.treeDataBase.initialize(
        [this.lineUnitCode.itemUnitID, this.lineUnitCode.unitCode] ,
        boms);
    }
  }

  addNewlevel(cell: any): void {
    const row = (cell.rowData as BOMNode);
    this.lineUnitCode.boms.push(Object.assign(new BOM(), {
      lineUnitID: row.lineUnitID,
      parentItemID: row.childItemID,
      parentItemCode: row.childItemCode,
      parentItemUnitID: row.childItemUnitID,
      parentUnitCode: row.childUnitCode,
      objType: row.objType,
      useSalePrice: row.useSalePrice,
      uIUpdate: true,
      bomCTID: null
    }));
    this.formInvalid = true;

    this.treeDataBase.initialize(
      [this.lineUnitCode.itemUnitID, this.lineUnitCode.unitCode] ,
      this.lineUnitCode.boms);
  }


  searchItems(cell: any, term: string): void {
    this.searchTermItems.next([
      (cell.rowData as BOMNode).parentItemUnitID, term]);
  }

  selectItem(event: MatAutocompleteSelectedEvent, cell: any): void {
    const row = (cell.rowData as BOMNode);
    const line = this.lineUnitCode.boms.filter(
      bom => bom.lineBomID === row.lineBomID)[0];
    const item = event.option.value as ItemMasterData;
    
    this.form.markAsDirty();
    line.uiUpdate = true;
    line.childItemCode = item.itemCode;
    line.childItemID = item.itemID;
    line.childItemUnitID = +Object.keys(item.itemUnits)[0];
    line.childUnitCode = item.itemUnits[line.childItemUnitID];
    line.baseUnitCode = item.baseUnitCode;

    row.uiUpdate = true;
    row.childItemCode = item.itemCode;
    row.childItemID = item.itemID;
    row.childItemUnitID = +Object.keys(item.itemUnits)[0];
    row.childUnitCode = item.itemUnits[row.childItemUnitID];
    row.baseUnitCode = item.baseUnitCode;
    this.formInvalid = false;
  }

  checkItem(cell: any): void {
    const row = (cell.rowData as BOMNode);
    if (!row.childItemCode ||
      !row.childItemID ||
      !row.childItemUnitID ||
      !row.childUnitCode ||
      !row.uiUpdate) {
        row.childItemCode = null;
        row.childItemID = null;
        row.childItemUnitID = null;
        row.childUnitCode = null;
        this.formInvalid = true;
    } else { 
      if (row.quantity) {
        this.checkItemCallBack(row);
      }
    }
  }

  checkItemQty(cell: any, qty: number): void {
    const row = (cell.rowData as BOMNode);
    const line = this.lineUnitCode.boms.filter(
      bom => bom.lineBomID === row.lineBomID)[0];
    line.quantity = qty;
    row.quantity = qty;
    this.checkItem(cell);
  }

  checkItemCallBack(bom: BOMNode): void {
    this.lineToUpdate.next(this.lineUnitCode);
  }

  changeInclude(cell: any): void {
    const row = (cell.rowData as BOMNode);
    const line = this.lineUnitCode.boms.filter(
      bom => bom.lineBomID === row.lineBomID)[0];
    
    row.include = !row.include;
    line.include = !line.include;
    line.uiUpdate = true;
    this.form.markAsDirty();
  }

  delete(cell: any): void {
    const row = (cell.rowData as BOMNode);
    this.deleteBomAndChildern(row);

    this.formInvalid = false;
    this.form.markAsDirty();

    this.treeDataBase.initialize(
      [this.lineUnitCode.itemUnitID, this.lineUnitCode.unitCode] ,
      this.lineUnitCode.boms);
  }

  deleteBomAndChildern(bom: BOMNode): void {
    if (bom.children && bom.children.length) {
      bom.children.forEach(bomChild => {
        this.deleteBomAndChildern(bomChild);
      });
    } 

    const index = this.lineUnitCode.boms.indexOf(bom);
    this.lineUnitCode.boms.splice(index, 1);
  }

}
