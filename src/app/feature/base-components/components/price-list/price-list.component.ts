import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { FormGroup, ControlContainer, FormGroupName } from '@angular/forms';

import { PriceListService } from 'app/core/services/price-list/price-list.service';
import { EMPTY, merge } from 'rxjs';
import { NumberFormaterService } from 'app/core/services/field-formaters/number-formater.service';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }]

})
export class PriceListComponent implements AfterViewInit {

  constructor(private priceListService: PriceListService,
              private numberFormaterService: NumberFormaterService) { }

  @Input()
  fatherForm: FormGroup;
  @Input()
  form: FormGroup;
  @Input()
  curCode: string;
  @Input()
  line: any;
  
  ngAfterViewInit(): void {
    merge(this.form.controls['itemID'].valueChanges,
      this.form.controls['unitCode'].valueChanges,
      this.form.controls['revisionCode'].valueChanges)
    .pipe(
      switchMap((term: any) => {
        if (term && 
          this.hasValueAndDirty()) {
            const revisionCode = 
              this.form.controls['revisionCode'].value ?
                this.form.controls['revisionCode'].value : null;
            return this.priceListService.getPriceForItem(
              this.fatherForm.controls['erpCompany'].value, 
              this.form.controls['itemID'].value,
              this.fatherForm.controls['bpCode'].value,
              this.form.controls['unitCode'].value, revisionCode);
        } else {
          return EMPTY;
        }
      })).subscribe(data => {
        this.line['price'] = data.price;
        const priceString = this.numberFormaterService
          .numberToString(data.price);
        this.form.controls['price'].setValue(
          priceString);
      }); 
  }

  hasValueAndDirty(): boolean {
    return  this.fatherForm.controls['erpCompany'].value &&
            this.fatherForm.controls['bpCode'].value &&
            this.form.controls['itemID'].value &&
            this.form.controls['unitCode'].value &&
            (!this.form.controls['itemID'].pristine ||
            !this.form.controls['unitCode'].pristine ||
            !this.form.controls['revisionCode'].pristine);
  }

  setPrice(priceTxt: string): void {
    const price = this.numberFormaterService
      .textFiledToNumber(priceTxt);
    if (isNaN(price)) {
      this.form.controls['price'].setValue('');
      return;
    }

    this.line['price'] = price;

    const priceString = this.numberFormaterService
      .numberToString(price);
    this.form.controls['price'].setValue(
      priceString);
  }

}
