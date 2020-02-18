import { Component, OnInit, Input, Output, 
  EventEmitter, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { ExpectedGoodsShipment } from '../ExpectedGoodsShipment';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';
import { ERPCompany } from 'app/erp-logistic-site/ErpLogisticSite';
import { Constants } from 'app/constants';
import { SeriesService } from 'app/core/services/series/series.service';
import { Series } from 'app/core/services/series/series';
import { ExpectedGoodsShipmentLinesComponent } from '../tabs/expected-goods-shipment-lines/expected-goods-shipment-lines.component';

@Component({
  selector: 'app-expected-goods-shipment-detail',
  templateUrl: './expected-goods-shipment-detail.component.html',
  styleUrls: ['./expected-goods-shipment-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExpectedGoodsShipmentDetailComponent 
  implements OnInit {

  @Input()
  expectedGoodsShipment: ExpectedGoodsShipment;
  
  form: FormGroup;
  docStatus: any[];
  erpCompanies: ERPCompany[];
  seriesArr: Series[];
  lastSender: string;
  
  @Output() saveEvent = new EventEmitter<ExpectedGoodsShipment>();
  @Output() saveAndWOEvent = new EventEmitter<ExpectedGoodsShipment>();
  @Output() formInit = new EventEmitter<FormGroup>();
  @ViewChild(ExpectedGoodsShipmentLinesComponent, { static: false}) 
    linesComponent: ExpectedGoodsShipmentLinesComponent;

  constructor(private _formBuilder: FormBuilder,
              private router: Router,
              private erpLogisticSiteService: ERPLogisticSiteService,
              private seriesService: SeriesService) { 

    this.docStatus = Constants.docStatus.slice(0);
    this.erpCompanies = this.erpLogisticSiteService.getCheckedERP();

    }

  ngOnInit(): void {
    
    this.form = this._formBuilder.group({
      docNum: [{
        value: this.expectedGoodsShipment.docNum, disabled: true
      }, Validators.required],
      erpDocNum: [{
        value: this.expectedGoodsShipment.erpDocNum, disabled: true
      }],
      bpCode: [{
        value: this.expectedGoodsShipment.bpCode, disabled: false
      }, Validators.required],
      bpName: [{
        value: this.expectedGoodsShipment.bpName, disabled: false
      }, Validators.required],
      bpDocNum: [{
        value: this.expectedGoodsShipment.bpDocNum, disabled: false
      }],
      createDate: [{
        value: this.expectedGoodsShipment.createDate, disabled: true
      }, Validators.required],
      updateDate: [{
        value: this.expectedGoodsShipment.updateDate, disabled: true
      }],
      confDueDate: [{
        value: this.expectedGoodsShipment.confDueDate, disabled: true
      }],
      reqDueDate: [{
        value: this.expectedGoodsShipment.reqDueDate, disabled: false
      }, Validators.required],
      reqWeek: [{
        value: this.expectedGoodsShipment.reqWeek, disabled: true
      }],
      confWeek: [{
        value: this.expectedGoodsShipment.confWeek, disabled: true
      }],
      docStatusCode: [{
        value: this.expectedGoodsShipment.docStatusCode, disabled: true
      }],
      expShipStID: [{
        value: this.expectedGoodsShipment.expShipStID, disabled: true
      }],
      seriesID: [{
        value: this.expectedGoodsShipment.seriesID, disabled: true
      }, Validators.required],
      erpCompany: [{
        value: this.expectedGoodsShipment.erpCompanyID, 
          disabled: this.expectedGoodsShipment.erpCompanyID ? true : false
      }],

      lines: this._formBuilder.array([])
    });

    this.erpSelectionChange();
    this.formInit.next(this.form);
  }

  erpSelectionChange(): void {
    if (this.form.get('erpCompany').value) {
      this.seriesService.loadListResults(
        'ExpShip', null, this.expectedGoodsShipment.logisticSiteCode).subscribe(data => {
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

  goBack(event: any): void {
    this.router.navigate(['/expected-goods-shipment']);
  }

  save(event: any): void {
    this.getValueForPost();
    this.saveEvent.next(this.expectedGoodsShipment);
  }

  postAndWO(event: any): void {
    this.getValueForPost();
    this.saveAndWOEvent.next(this.expectedGoodsShipment);
  }

  private getValueForPost(): void {
    this.expectedGoodsShipment.seriesID = this.form.get('seriesID').value;
    this.expectedGoodsShipment.bpName = this.form.get('bpName').value;
    this.expectedGoodsShipment.bpCode = this.form.get('bpCode').value;
    this.expectedGoodsShipment.reqDueDate = this.form.get('reqDueDate').value;
    this.expectedGoodsShipment.erpDocNum = this.form.get('erpDocNum').value;
    this.expectedGoodsShipment.bpDocNum = this.form.get('bpDocNum').value;
    this.updateLinesValuesFromForm();
  }

  updateLinesValuesFromForm(): void {
    this.expectedGoodsShipment.lines.forEach((element, index) => {
      const formLine =  ((this.form.get('lines') as FormArray).at(index) as FormGroup);
      element.logisticSiteCode = formLine.controls['logisticSiteCode'].value;
      element.bpDocNum = formLine.controls['bpDocNum'].value;
      element.itemID = formLine.controls['itemID'].value;
      element.itemCode = formLine.controls['itemCode'].value;
      element.itemName = formLine.controls['itemName'].value;
      element.frgnName = formLine.controls['frgnName'].value;
      element.baseQty = formLine.controls['baseQty'].value;
      element.revisionCode = formLine.controls['revisionCode'].value;
      element.lineStatusCode = formLine.controls['lineStatusCode'].value;
      element.expShipStID = formLine.controls['expShipStID'].value;
      element.allowPartialShip = formLine.controls['allowPartialShip'].value;
      element.allowPartialUOM = formLine.controls['allowPartialUOM'].value;
    
    });
  }

  addLine(event: any): void {
    this.linesComponent.create(event);
  }

}
