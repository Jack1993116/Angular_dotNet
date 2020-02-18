import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, FormArray, Validators } from '@angular/forms';
import { ExpectedGoodsShipmentService } from '../../expected-goods-shipment-service';
import { MatDialog } from '@angular/material';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';
import { ExpectedGoodsShipment, ExpectedGoodsShipmentLines, CompatibleLine } from '../../ExpectedGoodsShipment';
import { BehaviorSubject, Observable } from 'rxjs';
import { EntityApi } from 'app/shared/interfaces';
import { LinesDialogComponent } from 'app/shared/components/lines-dialog/lines-dialog.component';

@Component({
  selector: 'app-expected-goods-shipment-lines',
  templateUrl: './expected-goods-shipment-lines.component.html',
  styleUrls: ['./expected-goods-shipment-lines.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExpectedGoodsShipmentLinesComponent implements OnInit {

  @Input()
  expectedGoodsShipment: ExpectedGoodsShipment;
  @Input()
  form: FormGroup;
  dataSource = new BehaviorSubject<AbstractControl[]>([]);
  linesFormArray: FormArray;
  editableElement: FormGroup | null;

  public displayedColumns: string[] = ['lineSeq', 'erpDocNum',
    'bpDocNum', 'logisticSiteCode', 'item', 'baseQty',
    'allocated', 'onPlanning', 'onOrder', 'expRctQty', 'confDueDate',
    'lineStatusCode', 'createDate', 'updateDate', 'revisionCode',
    'allowPartialShip', 'allowPartialUOM',
    // 'allocPriority', 'overwritePriority'
    'delete'];

  constructor(private _formBuilder: FormBuilder,
              private expectedGoodsService: ExpectedGoodsShipmentService,
              private dialog: MatDialog,
              private erpLogisticSiteService: ERPLogisticSiteService) {
}

  ngOnInit(): void {
    this.linesFormArray = this.form.get('lines') as FormArray;
    this.expectedGoodsShipment.lines.forEach(element => {
      this.linesFormArray.push(this.initiatForm(element));
    });

    this.updateView();
  }
  
  initiatForm(line: ExpectedGoodsShipmentLines): FormGroup {
    return this._formBuilder.group({
      logisticSiteCode: [{
        value: line.logisticSiteCode, disabled: false 
      }, Validators.required],
      bpDocNum: [{
        value: line.bpDocNum, disabled: false
      }],
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
        value: line.frgnName, disabled: false
      }, Validators.required],
      baseQty: [{
        value: line.baseQty, disabled: false
      }, Validators.required],
      revisionCode: [{
        value: line.revisionCode, disabled: false
      }],
      lineStatusCode: [{
        value: line.lineStatusCode, disabled: false
      }],
      expShipStID: [{
        value: line.expShipStID, disabled: false
      }],
      allowPartialShip: [{
        value: line.allowPartialShip, disabled: false
      }, Validators.required],
      allowPartialUOM: [{
        value: line.allowPartialUOM, disabled: false
      }, Validators.required],
      // allocPriority: [{
      //   value: line.allocPriority, disabled: false
      // }, Validators.required],
      // overwritePriority: [{
      //   value: line.overwritePriority, disabled: false
      // }, Validators.required],
    });
  }

  updateView(): void {
    this.dataSource.next(
      (this.linesFormArray).controls);
  }

  create(event: any): void {
    this.getExpectedGoodsDraftShipment();
  }

  private getExpectedGoodsDraftShipment(): void {
    this.unEnableLastEdited();
    const linesSubscription = 
      this.expectedGoodsService.getExpectedShipmentDraftLines();
    
    this.openDialog(linesSubscription).subscribe(result => {
      if (result && result[0] === true) {
        const linesToAdd = result[1].selected as CompatibleLine[];
        linesToAdd.forEach(line => {
          const lineToAdd = Object.assign(
            new ExpectedGoodsShipmentLines(), {
              objType: line.objType,
              baseDocNum: line.docNum,
              baseLineID: line.lineId,
              baseDocID: line.docId,
              itemID: line.itemID,
              itemCode: line.itemCode,
              itemName: line.itemName,
              frgnName: line.itemFrgnName,
              baseQty: line.openQuantity,
              allowPartialShip: false,
              allowPartialUOM: false,
              expShipStID: 1,
              lineStatusCode: 'P',
              ShipItemUnitID: 1526
          });
          this.expectedGoodsShipment.lines.push(lineToAdd);
          this.linesFormArray.push(
            this.initiatForm(lineToAdd));
          this.updateView();
        });
      }
    });
  }

  openDialog(lines: Observable<EntityApi<CompatibleLine>>): Observable<any> {
    const dialogRef = this.dialog.open(LinesDialogComponent, {
      panelClass: 'lines-dialog',
      data: {
        dialogTitle: 'Add Expected Goods Lines',
        displayedColumns: [
          'select', 'objType', 'docId', 'lineId', 'docNum', 
          'itemID', 'itemCode', 'itemName', 'itemFrgnName',
          'openQuantity'
        ],
        lines: lines
      }
    });

    return dialogRef.afterClosed();
  }
  
  delete(lineIndex: number): void {
    this.expectedGoodsShipment.lines.splice(lineIndex, 1);
    this.linesFormArray.removeAt(lineIndex);
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

}
