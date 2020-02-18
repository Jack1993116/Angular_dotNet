import { Component, OnInit, OnChanges, 
  Input, Optional, ViewChild, ChangeDetectorRef, SimpleChange } from '@angular/core';
import { MatColumnDef, MatTable, MatSelectChange } from '@angular/material';
import { Observable } from 'rxjs';

import { ItemUnitOfMeasureService } from 'app/core/services/item-unit-of-measure/item-unit-of-measure.service';
import { ItemUnitOfMeasure } from 'app/core/services/item-unit-of-measure/ItemUnitOfMeasure';
import { UnitOfMeasureService } from 'app/core/services/unit-of-measure/unit-of-measure.service';
import { ItemMasterData } from 'app/feature/item-master-data/ItemMasterData';
import { SaleOrderLines } from 'app/feature/sale-order/SaleOrder';



@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {

  @Input()
  get columnName(): string { return this._columnName; }
  set columnName(name: string) {
    this._columnName = name;
  }
  _columnName: string;
  
  @Input()
  get modelBindingName(): string { return this._modelBindingName; }
  set modelBindingName(name: string) {
    this._modelBindingName = name;
  }
  _modelBindingName: string;
  
  units: { [key: string]: ItemUnitOfMeasure[] } = {};

  @ViewChild(MatColumnDef, { static: false }) column: MatColumnDef;
  
  @Input()
  lines: SaleOrderLines[];
  @Input()
  item: ItemMasterData;

  constructor(@Optional() public table: MatTable<any>,
              private cdRef: ChangeDetectorRef,
              private itemUnitOfMeasureService: ItemUnitOfMeasureService,
              private unitOfMeasureService: UnitOfMeasureService) { }

  ngOnInit(): void {
    if (this.table) {
      this.cdRef.detectChanges();
      this.column.name = this.columnName;
      this.table.addColumnDef(this.column);
    }

    this.lines.forEach(element => {
      this.searchUnits(element.logisticSiteCode,
          element.itemID);
      });
  }

  // ngOnChanges(changes: {[propKey: string]: SimpleChange}): void {
  //   if (Object.keys(changes).length === 1 &&
  //       changes['item']) {
  //     this.searchUnits()
  //   }
  // }

  searchUnits(logisticSiteCode: string, itemId: number): void {
    this.itemUnitOfMeasureService
      .getById(itemId, logisticSiteCode)
      .subscribe(data => {
        this.units[itemId] = data.items;
      });
  }

  unitSelectionChange(event: MatSelectChange, 
                      element: any): void {
      if (Object.keys(element).indexOf('shipItemUnitID') > 0) {
        // const valueSelected = this.units.filter(unit => 
        //     unit.unitCode === event.value)[0];
        // element.shipUnitCode = valueSelected.unitCode;
        // element.shipItemUnitID = valueSelected.itemUnitID;
      }
  }

}
