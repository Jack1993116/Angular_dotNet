import { Component, Input, OnInit, OnChanges, SimpleChanges,
  Output, EventEmitter, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

import { SaleOrder } from '../SaleOrder';
import { Constants } from 'app/constants';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';
import { ERPCompany } from 'app/erp-logistic-site/ErpLogisticSite';
import { SeriesService } from 'app/core/services/series/series.service';
import { Series } from 'app/core/services/series/series';
import { SaleOrderService, Attributes } from '../sale-order.service';
import { AttributesFormBuilderService } from 'app/core/services/attributes/attributes-form-builder.service';
import { SaleOrderLinesComponent } from '../tabs/sale-order-lines/sale-order-lines.component';
import { NumberFormaterService } from 'app/core/services/field-formaters/number-formater.service';

@Component({
  selector: 'app-sale-order-detail',
  templateUrl: './sale-order-detail.component.html',
  styleUrls: ['./sale-order-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaleOrderDetailComponent
  implements OnInit, OnChanges {

  @Input()
  saleOrder: SaleOrder;
  @Input()
  newSaleOrder = false;

  form: FormGroup;
  docStatus: any[];
  erpCompanies: ERPCompany[];
  seriesArr: Series[];
  attributes: Attributes[] = [];
  curCode: string;

  fileToUpload: File = null; 
  
  @Output() saveEvent = new EventEmitter<SaleOrder>();
  @Output() formInit = new EventEmitter<FormGroup>();
  @ViewChild(SaleOrderLinesComponent, { static: false}) 
    linesComponent: SaleOrderLinesComponent;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private erpLogisticSiteService: ERPLogisticSiteService,
    private seriesService: SeriesService,
    private saleOrderService: SaleOrderService,
    private attributesFormBuilderService: AttributesFormBuilderService<SaleOrder>,
    private numberFormaterService: NumberFormaterService) {  
    
    this.docStatus = Constants.docStatus.slice(0);
    this.erpCompanies = this.erpLogisticSiteService.getCheckedERP();

  }

  ngOnInit(): void { 
    this.initFormAndScreenValues();
    this.getAttributes();
  }

  ngOnChanges(changes: SimpleChanges): void { 
    if (changes['saleOrder'] && 
      !changes['saleOrder'].firstChange) {
        this.initFormAndScreenValues();
        this.addAttributesToFormAndTranslation();
      }
  }

  private initFormAndScreenValues(): void {
    if (this.saleOrder.lines && this.saleOrder.lines.length) {
      this.curCode = this.saleOrder.lines[0].curCode;
    }
    this.form = this._formBuilder.group({
      docNum: [{
        value: this.saleOrder.docNum, disabled: true
      }, Validators.required],
      erpDocNum: [{
        value: this.saleOrder.erpDocNum, disabled: true
      }, Validators.required],
      bpCode: [{
        value: this.saleOrder.bpCode, disabled: false
      }, Validators.required],
      bpName: [{
        value: this.saleOrder.bpName, disabled: false
      }, Validators.required],
      bpDocNum: [{
        value: this.saleOrder.bpDocNum, disabled: false
      }],
      docStatusCode: [{
        value: this.saleOrder.docStatusCode, disabled: true
      }, Validators.required],
      wfStatusID: [{
        value: this.saleOrder.wfStatusID, disabled: true
      }, Validators.required],
      seriesID: [{
        value: this.saleOrder.seriesID, disabled: true
      }, Validators.required],
      erpCompany: [{
        value: this.saleOrder.erpCompanyID,
        disabled: this.saleOrder.erpCompanyID ? true : false
      }],
      projectCode: [{
        value: this.saleOrder.projectCode, disabled: false
      }],
      curCode: [{
        value: this.curCode, disabled: false
      }, Validators.required],
      sysRate: [{
        value: this.saleOrder.sysRate, disabled: false
      }, Validators.required],
      localRate: [{
        value: this.saleOrder.localRate, disabled: false
      }, Validators.required],
      lines: this._formBuilder.array([])
    });
    this.erpSelectionChange();
    setTimeout(() => this.formInit.next(this.form), 1);
  }

  private getAttributes(): void {

    this.saleOrderService.getAttributes(this.saleOrder.erpCompanyID)
      .subscribe(data => {
        this.attributes = data;
        this.addAttributesToFormAndTranslation();
      });
  }



  private addAttributesToFormAndTranslation(): void {
    this.attributes.forEach(attribute => {
      this.attributesFormBuilderService
        .addFormControlFromAttribute(attribute, this.saleOrder, 
          this.form, false);
      this.attributesFormBuilderService
        .addTranslationForAttribute(attribute);
    });
  }

  dictonaryLen(obj: any): number {
    return Object.keys(obj).length;
  }

  goBack(event: any): void {
    this.router.navigate(['/sale-order']);
  }
  
  save(event: any): void {
    this.saleOrder.bpName = this.form.get('bpName').value;
    this.saleOrder.bpCode = this.form.get('bpCode').value;
    this.saleOrder.seriesID = this.form.get('seriesID').value;
    this.saleOrder.erpCompanyID = this.form.get('erpCompany').value;
    this.saleOrder.erpDocNum = this.form.get('erpDocNum').value;
    this.saleOrder.bpDocNum = this.form.get('bpDocNum').value;
    this.saleOrder.projectCode = this.form.get('projectCode').value;
    this.saleOrder.localRate = this.form.get('localRate').value;
    this.saleOrder.sysRate = this.form.get('sysRate').value;
    this.attributes.forEach(attr => {
      this.saleOrder.attributes[attr.id] = this.form.get(attr.name).value;
    });
    this.updateLinesValuesFromForm();
    // this.saleOrder.attributes[15] = this.form.get('EngineSubGroupID').value;
    this.saveEvent.next(this.saleOrder);
  }

  updateLinesValuesFromForm(): void {
    this.saleOrder.lines.forEach((element, index) => {
      const formLine =  ((this.form.get('lines') as FormArray).at(index) as FormGroup);
    
      this.linesComponent.attributes.forEach(attribute => {
        if (attribute.editable) {
          element.attributes[attribute.id] = 
          formLine.controls[attribute.name].value;
        }
      });

      element.logisticSiteCode = formLine.controls['logisticSiteCode'].value;
      element.itemID = formLine.controls['itemID'].value;
      element.itemCode = formLine.controls['itemCode'].value;
      element.itemName = formLine.controls['itemName'].value;
      element.itemFrgnName = formLine.controls['frgnName'].value;
      element.shipUnitCode = formLine.controls['unitCode'].value;
      element.shipItemUnitID = formLine.controls['shipItemUnitID'].value;
      element.quantity = this.numberFormaterService
        .textFiledToNumber(formLine.controls['quantity'].value);
      element.price = this.numberFormaterService
        .textFiledToNumber(formLine.controls['price'].value);
      element.priceRatio = formLine.controls['priceRatio'].value;
      element.discount = formLine.controls['discount'].value;
      element.revisionCode = formLine.controls['revisionCode'].value;
      element.allowPartialUOM = formLine.controls['allowPartialUOM'].value;
    });
  }

  erpSelectionChange(): void {
    if (this.form.get('erpCompany').value) {
      this.seriesService.loadListResults(
        'SalOrd', this.form.get('erpCompany').value).subscribe(data => {
          this.seriesArr = data;
          if (data.length === 1) {
           this.form.get('seriesID').setValue(data[0].seriesID);
           this.seriesSelectionChange();
          } else {
            this.form.controls['seriesID'].enable();
          }
      });
    }
  }

  seriesSelectionChange(): void {
    this.form.get('erpDocNum').setValue(
      this.seriesArr.filter(series => series.seriesID ===
        this.form.get('seriesID').value)[0].nextNumber
    );
  }

  addLine(event: any): void {
    this.linesComponent.create(event);
  }

  releaseAllLines(event: any): void {
    this.linesComponent.releaseQty();
  }

}
