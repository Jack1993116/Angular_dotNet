import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ControlContainer, FormGroupName } from '@angular/forms';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';

import { SaleOrderLines } from 'app/feature/sale-order/SaleOrder';
import { SaleOrderService } from 'app/feature/sale-order/sale-order.service';
import { EMPTY } from 'rxjs';
import { NumberFormaterService } from 'app/core/services/field-formaters/number-formater.service';

@Component({
  selector: 'app-quantity',
  templateUrl: './quantity.component.html',
  styleUrls: ['./quantity.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }]

})
export class QuantityComponent {

  @Input()
  form: FormGroup;
  @Input()
  line: SaleOrderLines;
  @Input()
  erpCompanyId: number;
  @Output() updatedSaleOrderLineEvent =
    new EventEmitter<SaleOrderLines>();

  constructor(private saleOrderService: SaleOrderService,
              private numberFormaterService: NumberFormaterService) { }

  setQuantity(quantityTxt: string): void {
    if (!quantityTxt) {
      return;
    }
    
    const quantity = this.numberFormaterService
      .textFiledToNumber(quantityTxt);
    if (isNaN(quantity)) {
      this.form.controls['quantity'].setValue('');
      return;
    }

    this.line['quantity'] = quantity;

    const quantityString = this.numberFormaterService
      .numberToString(quantity);
    this.form.controls['quantity'].setValue(
      quantityString);

    this.updateLineUnitCode(quantity);
  }

  updateLineUnitCode(quantity: number): void {
    this.saleOrderService
      .updateLineUnitBreakdown(this.line, this.erpCompanyId)
      .subscribe(data => {
        if (data) { 
           this.updatedSaleOrderLineEvent.next(data);
        }
      });
  }

}
