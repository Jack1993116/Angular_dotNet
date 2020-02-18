import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumberFormaterService {

  constructor() { }

  textFiledToNumber(numberAsText: string): number {
    if (numberAsText) {
      return +numberAsText.trim().replace(/,/g, '');
    } else {
      return 0;
    }
  }

  numberToString(num: number): string {
    if (num != null) {
      const numberParts = num.toFixed(2).split('.');
      numberParts[0] = numberParts[0]
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return numberParts.join('.');
    } else {
      return '';
    }
  }
}
