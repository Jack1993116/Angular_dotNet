import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { SaleOrder, SaleOrderLines } from '../../SaleOrder';
import { LineUnitCode } from './LineUnitCode';
import { SaleOrderService } from '../../sale-order.service';
import { MatSelectChange, MatTable } from '@angular/material';
import { ItemUnitOfMeasure } from 'app/core/services/item-unit-of-measure/ItemUnitOfMeasure';
import { ItemUnitOfMeasureService } from 'app/core/services/item-unit-of-measure/item-unit-of-measure.service';
import { BOMComponent } from '../bom/bom.component';
import { FormGroup, FormBuilder, AbstractControl, FormArray, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { ERPCompany } from 'app/erp-logistic-site/ErpLogisticSite';

@Component({
  selector: 'app-line-unit-code',
  templateUrl: './line-unit-code.component.html',
  styleUrls: ['./line-unit-code.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LineUnitCodeComponent implements OnInit, OnChanges {

  @Input()
  saleOrderLine: SaleOrderLines;
  @Input()
  selectedErp: ERPCompany;
  @Input()
  form: FormGroup;
  @Input()
  lineForm: FormArray;
  unitsForm: FormArray;
  unitsFormEnabled = false;
  loading = false;
  dataSource = new BehaviorSubject<AbstractControl[]>([]);
  @Output() updateLineQty = new EventEmitter<number>();
  
  columnsToDisplay: string[] = ['lineSeq', 'quantity', 
    'releasedQty', 'unitCode', 'baseQty', 'releasedBaseQty',
    'baseUnitCode', 'revisionCode', 'delete'];
  units: ItemUnitOfMeasure[] = [];
  unitsInUse: string[] = [];

  expandedElement: LineUnitCode | null;

  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  @ViewChildren(BOMComponent) viewChildren: QueryList<BOMComponent>;

  constructor(private saleOrderService: SaleOrderService,
              private itemUnitOfMeasureService: ItemUnitOfMeasureService,
              private _formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    if (this.saleOrderLine.itemID) {
      this.getUnitsbyItemId();
    }

    this.saleOrderLine.unitCodes.sort((a, b) => 
      (a.lineSeq > b.lineSeq) ? 1 : ((a.lineSeq < b.lineSeq) ? -1 : 0 ));
    this.markedUsedUnits();

    this.initFormLines();
    this.listenToFormEnable();
    this.updateView();
  }


  ngOnChanges(changes: SimpleChanges): void {
    const unitCodeLines = (changes['saleOrderLine'].currentValue['unitCodes'] as LineUnitCode[]);
    if (unitCodeLines && unitCodeLines.length) {
      unitCodeLines.sort((a, b) => 
        (a.lineSeq > b.lineSeq) ? 1 : ((a.lineSeq < b.lineSeq) ? -1 : 0 ));
      
      unitCodeLines.forEach(element => {
        const matchLine = this.saleOrderLine.unitCodes.filter
          (dataLine => dataLine.unitCode === element.unitCode)[0];
        if (matchLine) {
          element.lineUnitID = matchLine.lineUnitID;
        }
      });
    
      this.saleOrderLine = changes['saleOrderLine'].currentValue;
      this.getUnitsbyItemId();
      this.initFormLines();
      this.listenToFormEnable();
      this.updateView();
    }
  }

  getUnitsbyItemId(): void {
    if (!this.units ||
      this.units.length < 1) {
      this.itemUnitOfMeasureService.getById(
        this.saleOrderLine.itemID, 
        this.saleOrderLine.logisticSiteCode)
      .subscribe(data => {
        this.units = data.items;
      });
    }
  }

  private markedUsedUnits(): void {
    this.unitsInUse = [];
    this.saleOrderLine.unitCodes.forEach(element => {
      this.unitsInUse.push(element.unitCode);
    });
  }

  initFormLines(): void {
    this.unitsForm = this.lineForm.get('units') as FormArray;
    this.unitsForm.clear();
    this.saleOrderLine.unitCodes.forEach(unit => {
      const initializedForm = this.initialForm(unit);
      initializedForm.disable();
      this.unitsForm.push(initializedForm);
    });
  }

  initialForm(unit: LineUnitCode): FormGroup {
    return this._formBuilder.group({
      quantity: [{
        value: unit.quantity, disabled: false 
      }, Validators.required],
      unitCode: [{
        value: unit.unitCode, disabled: false 
      }, Validators.required],
      boms: this._formBuilder.array([])
    });
  }

  listenToFormEnable(): void {
    this.lineForm.valueChanges
      .pipe(startWith(this.lineForm))
      .subscribe(() => {
        if (this.lineForm.enabled &&
          !this.unitsFormEnabled) {
          this.unitsFormEnabled = true;
          this.unitsForm.controls.forEach(control => {
            control.enable();
          });
        }
        if (this.lineForm.disabled &&
          this.unitsFormEnabled) {
          this.unitsFormEnabled = false;
          this.unitsForm.controls.forEach(control => {
            control.disable();
          });
        }
      });
  }

  updateView(): void {
    this.dataSource.next(this.unitsForm.controls);
  }

  calcLineQty(qty: number, element: LineUnitCode): void {
    if (qty) {
      element.quantity = qty;
      this.saleOrderService
        .updateLineQuantityByUnitBreakdown(this.saleOrderLine, 
          this.selectedErp.erpCompanyID)
      .subscribe(data => {
        if (data) {
          const line = data.unitCodes.filter(unitLine =>
            unitLine.unitCode === element.unitCode)[0];
          const index = this.saleOrderLine.unitCodes.indexOf(element);
          this.saleOrderLine.unitCodes[index] = line;
          this.unitsForm.removeAt(index);
          this.unitsForm.push(this.initialForm(line));

          this.updateLineQty.next(data.quantity);
          this.updateView();
        }
      });
    }
  }

  unitSelectionChange(event: MatSelectChange, 
                      element: LineUnitCode): void {
    const unit = this.units.filter(item => 
      item.unitCode === event.value)[0];
    element.unitCode = unit.unitCode;
    element.baseItemUnitID = unit.itemUnitID;
    element.baseUnitCode = unit.baseUnit;
    element.itemUnitID = unit.itemUnitID;
    this.unitsInUse.push(event.value);
  }

  getUnusedUnits(lineUnitCode: string): ItemUnitOfMeasure[] {
    if (this.units && this.units.length) {
      return this.units.filter(unit => 
        this.unitsInUse.indexOf(unit.unitCode) < 0 ||
        unit.unitCode === lineUnitCode
      );
    } else {
      return [];
    }
  }

  addUnitLine(): void {
    if (this.units.length !== this.unitsInUse.length) {
      const unitLine = Object.assign(new LineUnitCode(), {
        objType: this.saleOrderLine.objType,
        docID: this.saleOrderLine.docID,
        boms: []
      });
      
      this.saleOrderLine.unitCodes.push(unitLine);
      this.unitsForm.push(this.initialForm(unitLine));
      this.updateView();
    }
  }

  resendBomData(element: LineUnitCode,
                index: number): void {
    this.saleOrderService.updateBomBreakdown(
      this.saleOrderLine, index, this.selectedErp.erpCompanyID,
      this.saleOrderLine.logisticSiteCode)
    .subscribe(data => {
      if (data) {
        this.removeUnitAndForm(index);
        this.saleOrderLine.unitCodes.push(data);
        this.unitsForm.push(this.initialForm(data));
        this.updateLineQty.next(this.saleOrderLine.quantity);
        this.updateView();
      }
    });
  }

  delete(lineIndex: number): void {
    const unitToRemove = this.removeUnitAndForm(lineIndex);

    const unitIndex = this.unitsInUse.indexOf(this.unitsInUse.filter(
      unit => unit === unitToRemove.unitCode)[0]);
    this.unitsInUse.splice(unitIndex, 1);
    this.updateView();

    if (this.saleOrderLine.unitCodes.length === 0) {
      this.updateLineQty.next(0);
    } else {
      this.updateLineQty.next(this.saleOrderLine.quantity);
    }
  }

  private removeUnitAndForm(lineIndex: number): LineUnitCode {
    const unitToRemove = this.saleOrderLine.unitCodes
      .splice(lineIndex, 1)[0];
    this.unitsForm.removeAt(lineIndex);
    return unitToRemove;
  }

  init(index: number): void {
    if (this.expandedElement !==  
      this.saleOrderLine.unitCodes[index]) {
      this.loading = true;
    }
    setTimeout(() => {
      this.expandedElement = 
        this.expandedElement === this.saleOrderLine.unitCodes[index] ? null :
          this.saleOrderLine.unitCodes[index];
    }, 1);
  }
}
