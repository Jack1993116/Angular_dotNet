import { Component, OnInit, Input, ViewEncapsulation, OnChanges, SimpleChanges, ViewChild, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { BOM } from '../BOM';
import { SearchItemsBom } from 'app/feature/base-components/abstract-classes/search-items-bom';
import { ItemMasterDataService } from 'app/feature/item-master-data/item-master-data.service';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material';
import { ItemMasterData } from 'app/feature/item-master-data/ItemMasterData';
import { Subscription } from 'rxjs';
import { ERPCompany } from 'app/erp-logistic-site/ErpLogisticSite';

@Component({
  selector: 'app-bom-form',
  templateUrl: './bom-form.component.html',
  styleUrls: ['./bom-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BOMFormComponent 
  extends SearchItemsBom
  implements OnInit, OnChanges, AfterViewInit {

  @Input()
  selectedErp: ERPCompany;
  @Input()
  selectedCurCode: string;
  @Input()
  logisticSite: string;
  @Input()
  bom: BOM;
  @Input()
  unitForm: FormGroup;
  bomForm: FormArray;
  form: FormGroup;
  @Input()
  formEnableDisable: boolean;
  @Output() 
  newChild = new EventEmitter<BOM>();
  @Output()
  lineToUpdate = new EventEmitter<BOM>();
  @Output()
  delete = new EventEmitter<BOM>();
  
  subscription: Subscription;
  
  @ViewChild(MatAutocompleteTrigger, { static: false }) 
    trigger: MatAutocompleteTrigger;
    
  constructor(private _formBuilder: FormBuilder,
              public itemMasterDataService: ItemMasterDataService) {
    super(itemMasterDataService);
   }

  ngOnInit(): void {
    this.bomForm =  this.unitForm.get('boms') as FormArray;
    this.form = this._formBuilder.group({
      lineSeq: [{
        value: this.bom.lineSeq, disabled: true
      }],
      childItemCode: [{
        value: this.bom.childItemCode, disabled: true
      }, Validators.required],
      childUnitCode: [{
        value: this.bom.childUnitCode, disabled: true
      }],
      bomQty: [{
        value: this.bom.bomQty, disabled: true
      }],
      bomToTopQty: [{
        value: this.bom.bomToTopQty, disabled: true
      }],
      quantity: [{
        value: this.bom.quantity, disabled: false
      }, Validators.required],
      baseUnitCode: [{
        value: this.bom.baseUnitCode, disabled: true
      }],
      baseQty: [{
        value: this.bom.baseQty, disabled: true
      }],
      childRevisionCode: [{
        value: this.bom.childRevisionCode, disabled: true
      }],
      salePrice: [{
        value: this.bom.salePrice, disabled: true
      }],
      discount: [{
        value: this.bom.discount, disabled: true
      }],
      lineTotal: [{
        value: this.bom.lineTotal, disabled: true
      }],
      localLineTotal: [{
        value: this.bom.localLineTotal, disabled: true
      }],
      sysLineTotal: [{
        value: this.bom.sysLineTotal, disabled: true
      }],
      costPrice: [{
        value: this.bom.costPrice, disabled: true
      }],
      costTotal: [{
        value: this.bom.costTotal, disabled: true
      }],
      localCostTotal: [{
        value: this.bom.localCostTotal, disabled: true
      }],
      sysCostTotal: [{
        value: this.bom.sysCostTotal, disabled: true
      }],
      include: [{
        value: this.bom.include, disabled: true
      }],
      grossProfit: [{
        value: this.getGrossProfit(), disabled: true
      }],
      grossProfitPer: [{
        value: this.getGrossProfitPer(), disabled: true
      }]
    });
    this.form.disable();
    this.bomForm.push(this.form);

    this.logisticSiteCode = this.logisticSite;
    this.wireUpSearch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formEnableDisable'] &&
      !changes['formEnableDisable'].firstChange &&
      changes['formEnableDisable'].currentValue !== 
        changes['formEnableDisable'].previousValue &&
      changes['formEnableDisable'].currentValue) {
      this.enableFields();
      this._subscribeToClosingActions();
    }
  }

  ngAfterViewInit(): void {
    if (this.form.controls &&
      this.unitForm.enabled) {
        this.enableFields();
      }
  }
  
  enableFields(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].disable();
    });
    this.form.controls['quantity'].enable();
    this.form.controls['childItemCode'].enable();
    this.form.controls['salePrice'].enable();
    this.form.controls['include'].enable();
  }

  public wireUpSearch(): void {
    super.wireUpSearchItems();
  }

  private _subscribeToClosingActions(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.trigger.panelClosingActions
      .subscribe(e => {
        if (!e || !e.source) {
          this.form.controls['childItemCode'].setValue(null);
          this.form.controls['childUnitCode'].setValue(null);
          this.form.controls['baseUnitCode'].setValue(null);
        }
      },
      err => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions());
  }

  searchItems(term: string): void {
    this.searchTermItems.next([
      this.bom.parentItemUnitID, term]);
  }

  selectItem(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as ItemMasterData;
    this.bom.uiUpdate = true;
    this.bom.childItemCode = item.itemCode;
    this.form.controls['childItemCode'].setValue(
      item.itemCode);
    this.bom.childItemID = item.itemID;
    this.bom.childItemUnitID = +Object.keys(item.itemUnits)[0];
    this.bom.childUnitCode = item.itemUnits[this.bom.childItemUnitID];
    this.form.controls['childUnitCode'].setValue(
      this.bom.childUnitCode);
    this.bom.baseUnitCode = item.baseUnitCode;
    this.form.controls['baseUnitCode'].setValue(
      item.baseUnitCode);
    this.checkItemCallBack();
  }

  setQty(): void {
    this.bom.uiUpdate = true;
    this.bom.quantity = 
      this.form.controls['quantity'].value;
    this.checkItemCallBack();
  }

  changeInclude(): void {
    this.bom.uiUpdate = true;
    this.bom.include = !this.bom.include;
  }

  changeSalePrice(): void {
    this.bom.uiUpdate = true;
    this.bom.salePrice = 
      this.form.controls['salePrice'].value;
  }

  getGrossProfit(): number {
    let grossProfit = 0;
    const localTotal = this.bom.localLineTotal;
    grossProfit = localTotal - 
      this.bom.localCostTotal;
    return grossProfit;
  }

  getGrossProfitPer(): number {
    let grossProfitPer = 0;
    const grossProfit = this.getGrossProfit();
    const localTotal = this.bom.localLineTotal; 
    if (localTotal !== 0) {
      grossProfitPer = (grossProfit / localTotal) * 100;
    }
    return grossProfitPer;
  }

  addNewlevel(): void {
    this.bom.uiUpdate = true;
    const newBomChild = Object.assign(new BOM(), {
      lineUnitID: this.bom.lineUnitID,
      parentItemID: this.bom.parentItemID,
      parentItemCode: this.bom.childItemCode,
      parentItemUnitID: this.bom.childItemUnitID,
      parentUnitCode: this.bom.childUnitCode,
      objType: this.bom.objType,
      useSalePrice: this.bom.useSalePrice,
      uIUpdate: true,
      bomCTID: null
    });
    this.newChild.next(newBomChild);
  }

  checkItemCallBack(): void {
    if (this.bom.quantity &&
      this.bom.childItemCode) {
        this.lineToUpdate.next(this.bom);
      }
  }

  save(): void {
    
  }
}
