import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms'; 
import { BehaviorSubject, Observable } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { startWith, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { SaleOrder, SaleOrderLines } from '../../SaleOrder';
import { SaleOrderService, Attributes } from '../../sale-order.service';
import { AttributesFormBuilderService } from 'app/core/services/attributes/attributes-form-builder.service';
import { ExtendedExpectedGoodsShipmentL } from 'app/feature/expected-goods-shipment/ExpectedGoodsShipment';
import { EntityApi } from 'app/shared/interfaces';
import { ExpectedGoodsShipmentService } from 'app/feature/expected-goods-shipment/expected-goods-shipment-service';
import { NumberFormaterService } from 'app/core/services/field-formaters/number-formater.service';

import { LinesDialogComponent } from 'app/shared/components/lines-dialog/lines-dialog.component';
import { LinesQtyChecker } from 'app/shared/components/lines-dialog/lines-checker/lines-qty-checker.service';
import { SingleLineQtyChecker } from 'app/shared/components/lines-dialog/lines-checker/single-line-qty-checker.service';
import { BaseLinesChecker } from 'app/shared/components/lines-dialog/lines-checker/base-lines-checker';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';
import { ERPCompany } from 'app/erp-logistic-site/ErpLogisticSite';

@Component({
  selector: 'app-sale-order-lines',
  templateUrl: './sale-order-lines.component.html',
  styleUrls: ['./sale-order-lines.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SaleOrderLinesComponent 
  implements OnInit, OnChanges  {

  @Input()
  saleOrder: SaleOrder;
  @Input()
  form: FormGroup;
  dataSource = new BehaviorSubject<AbstractControl[]>([]);
  attributes: Attributes[] = [];
  expandedElement: SaleOrderLines | null;
  editableElement: FormGroup | null;
  linesSubject = new BehaviorSubject<SaleOrderLines[]>([]);
  selectedErp: ERPCompany;
  
  public displayedColumns: string[] = ['lineSeq',
    'logisticSiteCode', 'item', 'unitCode', 'revisionCode',
    'quantity', 'price', 'priceRatio',
    'discount', 'localLineTotal', 'sysLineTotal', 'lineTotal',
    'localCostTotal', 'sysCostTotal',
    'releasedQty', 'openQty', 'shipQty', 'lineStatusCode', 'createDate', 
    'updateDate', 'allowPartialUOM', 'action'];

  @ViewChild('formTab', { read: ElementRef, static: false }) 
    formTab: ElementRef<any>;
    
  constructor(private _formBuilder: FormBuilder,
              private saleOrderService: SaleOrderService,
              private attributesFormBuilderService: AttributesFormBuilderService<SaleOrderLines>,
              private router: Router,
              private erpLogisticSiteService: ERPLogisticSiteService,
              private dialog: MatDialog,
              private expectedGoodsShipmentService: ExpectedGoodsShipmentService,
              private numberFormaterService: NumberFormaterService,
              private linesQtyChecker: LinesQtyChecker,
              private singleLineQtyChecker: SingleLineQtyChecker) { }

  ngOnInit(): void {
    this.initFormAndLines();
    this.form.controls['erpCompany'].valueChanges
      .pipe(startWith(this.form.controls['erpCompany'].value))
      .subscribe(() => {
        if (this.form.controls['erpCompany'].value) {
          this.getAttributes();
          this.selectedErp = this.erpLogisticSiteService
            .getCheckedERP(this.form.controls['erpCompany'].value)[0];
        }
      });
    this.updateView();

  }

  reOrgenizeColumns(): void {
    this.displayedColumns = ['lineSeq', 'item',
      'Width', 'Height', 'SleavDep', 'mrSize', 'WidthMultiSection',
      'HeightMultiSection', 'Sections', 'mrSizeSection',
      'WidthSectionType1',  'HeightSectionType1',
      'WidthSectionType2', 'HeightSectionType2',
      'TempElectMain', 'TempElect', 'MaxTemp', 'Voltage',
      'Switch', 'EngineSide', 'InstallType', 'ThermSelect',
      'quantity', 'unitCode', 'price', 'priceRatio', 'discount',
      'lineTotal', 'localCostTotal', 'grossProfit', 'grossProfitPer',
      'logisticSiteCode', 'releasedQty', 'action'
    ];
    this.linesReCalc();
  }

  linesReCalc(): void {
    this.saleOrder.lines.forEach((line, index) => {
      if (line.attributes[9]) {
        const formControls = 
          ((this.form.get('lines') as FormArray).controls[index] as FormGroup)
            .controls;
        this.calcPriceRatio(line, formControls);
      }
    });
  }
  
  private calcPriceRatio(line: SaleOrderLines, controls: any): void {
    if (line.attributes[9] < 0.25) {
      controls['priceRatio'].setValue(0.25);
    }
    else {
      controls['priceRatio'].setValue(line.attributes[9]);
    }
  }

  ngOnChanges(changes: SimpleChanges): void { 
    if (changes['saleOrder'] && 
      !changes['saleOrder'].firstChange) {
        this.initFormAndLines();
    }
    
    this.attributes.forEach(attribute => {
      this.addAttributesToForm(attribute);
    });

    this.updateView();
  }

  private initFormAndLines(): void {
    const control = this.form.get('lines') as FormArray;
    this.saleOrder.lines.forEach(element => {
      control.push(this.initiatForm(element));
    });
    
  }

  initiatForm(line: SaleOrderLines): FormGroup {
    return this._formBuilder.group({
      logisticSiteCode: [{
        value: line.logisticSiteCode, disabled: false 
      }, Validators.required],
      itemID: [{
        value: line.itemID, disabled: true
      }, Validators.required],
      itemCode: [{
        value: line.itemCode, disabled: false
      }, Validators.required],
      itemName: [{
        value: line.itemName, disabled: false
      }, Validators.required],
      frgnName: [{
        value: line.itemFrgnName, disabled: false
      }, Validators.required],
      unitCode: [{
        value: line.shipUnitCode, disabled: false 
      }, Validators.required],
      shipItemUnitID: [{
        value: line.shipItemUnitID, disabled: true
      }, Validators.required],
      quantity: [{
        value: this.numberFormaterService
          .numberToString(line.quantity), disabled: false
      }, [Validators.required, Validators.min(0)]],
      price: [{
        value: this.numberFormaterService
          .numberToString(line.price), disabled: false
      }, [Validators.required, Validators.min(0)]],
      priceRatio: [{
        value: line.priceRatio, disabled: true
      }, [Validators.required, Validators.min(0)]],
      discount: [{
        value: line.discount, disabled: false
      }, [Validators.required, Validators.max(100), Validators.min(0)]],
      revisionCode: [{
        value: line.revisionCode, disabled: false
      }],
      allowPartialUOM: [{
        value: line.allowPartialUOM, disabled: false
      }, Validators.required],
      units: this._formBuilder.array([])
    });
  }

  getAttributes(): void {
    const deleteColumn = this.displayedColumns.pop();
    this.saleOrderService.getLineAttributes(
      this.form.controls['erpCompany'].value)
      .subscribe(data => {
        this.attributes = data;
        this.attributes.forEach(attribute => {
          this.displayedColumns.push(attribute.name);
          this.addAttributesToForm(attribute);
          this.attributesFormBuilderService
            .addTranslationForAttribute(attribute);
        });
        this.displayedColumns.push(deleteColumn);
        this.reOrgenizeColumns();
        (this.form.get('lines') as FormArray).controls
        .forEach(form => {
          (form as FormGroup).disable();
        });
      });
  }

  private addAttributesToForm(attribute: Attributes): void {
    if (attribute.editable) {
      this.saleOrder.lines.forEach(line => {
        const index = this.saleOrder.lines.indexOf(line);
        this.attributesFormBuilderService
          .addFormControlFromAttribute(attribute, line, 
            ((this.form.get('lines') as FormArray).at(index) as FormGroup),
             false);
      });
    }
  }

  updateView(): void {
    this.dataSource.next(
      (this.form.get('lines') as FormArray).controls);
  }

  updateLine(line: SaleOrderLines, index: number): void {
    const lineAttributes = this.saleOrder.lines[index].attributes;
    const curCode = this.saleOrder.lines[index].curCode;
    this.saleOrder.lines[index] = line;
    this.saleOrder.lines[index].attributes = lineAttributes;
    this.saleOrder.lines[index].curCode = curCode;
  }

  getLineTotal(index: number): number {
    const formControls = 
    ((this.form.get('lines') as FormArray).controls[index] as FormGroup)
      .controls;
    let lineTotal = 0;
    if (formControls['quantity'].value) {
      if (formControls['price'].value) {
        if (formControls['priceRatio'].value) {
          lineTotal = this.numberFormaterService
            .textFiledToNumber(formControls['quantity'].value) *
          this.numberFormaterService
            .textFiledToNumber(formControls['price'].value) *
          formControls['priceRatio'].value;
          if (formControls['discount'].value &&
          formControls['discount'].value !== 0) {
            lineTotal *= (1 - (formControls['discount'].value / 100));
          }

        }
      }
    }
    return lineTotal;
  }

  getLocalLineTotal(index: number): number {
    let localLineTotal = 0;
    if (this.form.get('localRate').value) {
      localLineTotal = this.getLineTotal(index) * 
        this.form.get('localRate').value;
    }
    return localLineTotal;
  }

  getSysLineTotal(index: number): number {
    let sysLineTotal = 0;
    const localTotal = this.getLocalLineTotal(index);
    if (this.form.get('sysRate').value &&
        localTotal !== 0) {
      sysLineTotal = localTotal / 
        this.form.get('sysRate').value;
    }
    return sysLineTotal;
  }

  getGrossProfit(index: number): number {
    let grossProfit = 0;
    const localTotal = this.getLocalLineTotal(index);
    grossProfit = localTotal - 
      this.saleOrder.lines[index].localCostTotal;
    return grossProfit;
  }

  getGrossProfitPer(index: number): number {
    let grossProfitPer = 0;
    const grossProfit = this.getGrossProfit(index);
    const localTotal = this.getLocalLineTotal(index); 
    if (localTotal !== 0) {
      grossProfitPer = (grossProfit / localTotal) * 100;
    }
    return grossProfitPer;
  }

  updateLineQty(qty: number, index: number): void {
    ((this.form.get('lines') as FormArray).controls[index] as FormGroup)
      .controls['quantity'].setValue(
        this.numberFormaterService
        .numberToString(qty));
  }
  
  create(event: any): void {
    const line = Object.assign(new SaleOrderLines(), {
      lineStatusCode: 'P',
      priceRatio: 1,
      price: 0,
      discount: 0,
      attributes: {},
      allowPartialUOM: false,
      unitCodes: [],
      curCode: this.form.controls['curCode'].value
    });
    this.attributes.forEach(attribute => {
      line.attributes[attribute.id] = null;
    });
    this.saleOrder.lines.push(line);

    this.unEnableLastEdited();
    const control = this.initiatForm(line);
    this.editableElement = control;
    (this.form.get('lines') as FormArray).push(control);

    this.attributes.forEach(attribute => {
      if (attribute.editable) {
        const index = this.saleOrder.lines.indexOf(line);
        this.attributesFormBuilderService
        .addFormControlFromAttribute(attribute, line,
          ((this.form.get('lines') as FormArray).at(index) as FormGroup),
          false);
      }
    });

    this.updateView();
  }
  
  delete(lineIndex: number): void {
    this.saleOrder.lines.splice(lineIndex, 1);
    (this.form.get('lines') as FormArray).removeAt(lineIndex);
    this.updateView();
  }

  edit(lineIndex: number): void {
    const control = ((this.form.get('lines') as FormArray)
      .controls[lineIndex] as FormGroup);
    if (this.editableElement === control) {
      this.editableElement = null;
      control.disable();
    } else {
      this.unEnableLastEdited();
      this.editableElement = control;
      control.enable();
    }
  }

  private unEnableLastEdited(): void {
    if (this.editableElement) {
      this.editableElement.disable();
    }
  }

  dictonaryLen(obj: any, column: any): number {
    return Object.keys(obj).length;
  }


  updateConnectedField(id: number, index: number, line: SaleOrderLines): void {
    const WidthMultiSectionRatio = 92;
    const HeightMultiSectionRatio = 122.5;
    const WidthId = 4;
    const Width = this.attributeIdToName(WidthId);
    const HeightId = 5;
    const Height = this.attributeIdToName(HeightId);
    const mrSizeId = 9;
    const mrSize = this.attributeIdToName(mrSizeId);
    const WidthMultiSectionId = 10;
    const WidthMultiSection = this.attributeIdToName(WidthMultiSectionId);
    const HeightMultiSectionId = 11;
    const HeightMultiSection = this.attributeIdToName(HeightMultiSectionId);
    const SectionsId = 12;
    const Sections = this.attributeIdToName(SectionsId);
    const mrSizeSectionId = 13;
    const mrSizeSection = this.attributeIdToName(mrSizeSectionId);
    const formControls = 
      ((this.form.get('lines') as FormArray).controls[index] as FormGroup)
        .controls;
        
    if (id === WidthId || 
        id === HeightId) {
      line.attributes[mrSizeId] = (formControls[Width].value / 100) *
          (formControls[Height].value / 100);

      this.calcPriceRatio(line, formControls);

      if (formControls[Width].value > WidthMultiSectionRatio) {
        line.attributes[WidthMultiSectionId] =
          Math.ceil(formControls[Width].value / 
            WidthMultiSectionRatio);
      } else {
        line.attributes[WidthMultiSectionId] = 1;
      }

      if (formControls[Height].value > HeightMultiSectionRatio) {
        line.attributes[HeightMultiSectionId] =  
          Math.ceil(formControls[Height].value / 
            HeightMultiSectionRatio);
      } else {
        line.attributes[HeightMultiSectionId] = 1;
      }

      line.attributes[SectionsId] =  
        line.attributes[HeightMultiSectionId] *
          line.attributes[WidthMultiSectionId];
      
      line.attributes[mrSizeSectionId] =
        line.attributes[mrSizeId] /
          line.attributes[SectionsId];
    }
  }

  attributeIdToName(id: number): string {
    return this.attributes.filter(attribute => 
      attribute.id === id)[0].name;
  }

  releaseQty(): void {
    const lines: ExtendedExpectedGoodsShipmentL[] = [];
    const linesSubscription = 
      this.getReleasedLinesForSaleOrder(this.saleOrder.docID,
        this.saleOrder.erpCompanyID, lines);
    
    const displayedColumns = ['SOlineSeq', 'itemCode', 'SOQty', 'SOReleasedQty',
      'docNum', 'lineSeq', 'reqDueDate', 'confDueDate', 'baseQty'];    
    this.openDialog(linesSubscription, displayedColumns, 
      this.linesQtyChecker).subscribe(result => {
        this.handleDialogResualt(result, lines);
    });
  }

  releaseQtyLine(line: SaleOrderLines): void {
    const lines: ExtendedExpectedGoodsShipmentL[] = [];
    const linesSubscription = 
      this.getReleasedLinesForSaleOrderLine(line, lines);
    
    const displayedColumns = ['docNum', 'lineSeq', 
      'reqDueDate', 'confDueDate', 'baseQty'];
    this.openDialog(linesSubscription, displayedColumns, 
      this.singleLineQtyChecker, line.quantity)
      .subscribe(result => {
        this.handleDialogResualt(result, lines, line);
    });
  }

  private getReleasedLinesForSaleOrder(
    docID: number, erpCompanyID: number, lines: ExtendedExpectedGoodsShipmentL[])
    : Observable<EntityApi<ExtendedExpectedGoodsShipmentL>> {
    return this.expectedGoodsShipmentService.getBySaleOrder
      (docID, erpCompanyID).pipe(
        tap(data => {
          data.items.forEach(element => {
            lines.push(Object.assign(new ExtendedExpectedGoodsShipmentL(), element));
          });
        })
    );
  }

  private getReleasedLinesForSaleOrderLine(
    line: SaleOrderLines,
    lines: ExtendedExpectedGoodsShipmentL[])
    : Observable<EntityApi<ExtendedExpectedGoodsShipmentL>> {
    return this.expectedGoodsShipmentService.getBySaleOrderLine
      (line.lineID, line.logisticSiteCode).pipe(
        tap(data => {
          data.items.forEach(element => {
            lines.push(Object.assign(new ExtendedExpectedGoodsShipmentL(), element));
          });
        })
    );
  }

  private openDialog(lines: Observable<EntityApi<ExtendedExpectedGoodsShipmentL>>,
                     columns: string[], chcker: BaseLinesChecker, qty?: number)
    : Observable<any> {
    const dialogRef = this.dialog.open(LinesDialogComponent, {
      panelClass: 'lines-dialog',
      data: {
        dialogTitle: 'Release Quantity',
        displayedColumns: columns,
        lines: lines,
        lineQty: qty,
        linesChcker: chcker
      }
    });

    return dialogRef.afterClosed();
  }

  private handleDialogResualt(result: any, lines: ExtendedExpectedGoodsShipmentL[], 
                              line?: SaleOrderLines): void {
    if (!result)
    {
      return;
    }
    if (result[0] === true) { // Save
      const linesToUpdate: ExtendedExpectedGoodsShipmentL[] = 
        this.getChangedLines(lines, result);
      
      if (linesToUpdate.length > 0) {
        if (line) {
          this.updateLineFromExpectedLinesAllocation(linesToUpdate, line);
        } else {
          this.updateFromExpectedLinesAllocation(linesToUpdate);
        }
      }
    } else {
      if (result[1] === true) { // Create
        const saleOrderToCreateExpectedGoods = Object.assign(
          new SaleOrder(), this.saleOrder );
        saleOrderToCreateExpectedGoods.lines = [];
        if (line) {
          saleOrderToCreateExpectedGoods.lines.push(line);
        } else {
          this.saleOrder.lines.forEach(orderLine => {
            saleOrderToCreateExpectedGoods.lines.push(orderLine);
          });
        }
        this.router.navigate(['/expected-goods-shipment/create'], {
          state: { saleOrder: saleOrderToCreateExpectedGoods }});
      }
    }
  }
  
  private getChangedLines(lines: ExtendedExpectedGoodsShipmentL[], result: boolean)
    : ExtendedExpectedGoodsShipmentL[] {
    const linesToUpdate: ExtendedExpectedGoodsShipmentL[] = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].baseQty !== result[1][i].baseQty) {
        linesToUpdate.push(result[1][i] as ExtendedExpectedGoodsShipmentL);
      }
    }
    return linesToUpdate;
  }

  private updateLineFromExpectedLinesAllocation(
    linesToUpdate: ExtendedExpectedGoodsShipmentL[], 
    line: SaleOrderLines): void {
    this.expectedGoodsShipmentService
      .updateSaleOrderLineByExpectedGoodsLines(linesToUpdate)
      .subscribe(data => {
        const index = this.saleOrder.lines.indexOf(line, 0);
        if (index > -1) {
          this.saleOrder.lines[index] = data;
        }
        this.updateView();
      });
  }

  private updateFromExpectedLinesAllocation(
    linesToUpdate: ExtendedExpectedGoodsShipmentL[]): void {
      this.expectedGoodsShipmentService
        .updateSaleOrderByExpectedGoodsLines(linesToUpdate)
        .subscribe(date => {
          if (date) {
            this.saleOrder = date;
            this.updateView();
          }
        });
    }
  
  scrollLeft(): void {
    this.formTab.nativeElement.scrollLeft = 0;
  }
}
