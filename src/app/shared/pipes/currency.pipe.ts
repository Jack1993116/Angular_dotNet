import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from 'app/core/services/currency/currency.service';

@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {

  constructor(private currencyService: CurrencyService) {
  }

  transform(curCode: any, ...args: any[]): string {
    if (curCode) {
    return this.currencyService.getSymbolForCurCode
      (curCode);
    } else {
      return '';
    }
  }

}
