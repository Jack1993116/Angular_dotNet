import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Constants } from 'app/constants';
import { Currency } from './Currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private CurrencyList: Currency[];
  private baseApi: string;

  constructor(private httpClient: HttpClient) { 
    this.baseApi = `${Constants.clientRoot}api/Currency`;
    this.CurrencyList = [Object.assign(new Currency(), {
      curCode: 'USD',
      curSymbol: '$'
    }),
    Object.assign(new Currency(), {
      curCode: 'CAD',
      curSymbol: '$CAD'
    }),
    Object.assign(new Currency(), {
      curCode: 'EUR',
      curSymbol: '€'
    }),
    Object.assign(new Currency(), {
      curCode: 'NIS',
      curSymbol: '₪'
    })];
  }

  // TODO: Service should have all Currency for all ERPs
  getSymbolForCurCode(code: string): string {
    return this.CurrencyList.filter(
      currency => currency.curCode === code)[0].curSymbol;
  }

  loadListResults(erpCompanyId: number): Observable<Currency[]> {
    return this.httpClient.get<Currency[]>(
      `${this.baseApi}?erpCompanyId=${erpCompanyId}`, {
        headers: this.headers });
  }
}
