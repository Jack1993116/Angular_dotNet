import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Constants } from 'app/constants';
import { ItemPrice } from './ItemPrice';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private baseApi: string;

  constructor(private httpClient: HttpClient) { 
    this.baseApi = `${Constants.clientRoot}api/PriceList`;
  }

  getPriceForItem(erpCompanyId: number, 
                  itemId: number, bpCode: number,
                  unitCode: string, itemRevId?: number): Observable<ItemPrice> {
      return this.httpClient.get<ItemPrice>(
        `${this.baseApi}/GetItemPrice?erpCompanyId=${erpCompanyId}` +
        `&itemId=${itemId}&bpCode=${bpCode}&unitCode=${unitCode}` + 
        (itemRevId ? `&itemRevId=${itemRevId}` : ''), {
          headers: this.headers });
  }
}
