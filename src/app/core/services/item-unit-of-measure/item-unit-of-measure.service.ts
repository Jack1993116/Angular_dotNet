import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';

import { Constants } from 'app/constants';
import { ItemUnitOfMeasure } from './ItemUnitOfMeasure';
import { EntityApi } from 'app/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ItemUnitOfMeasureService {

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private baseApi: string;  

  constructor(private httpClient: HttpClient) {
    this.baseApi = `${Constants.clientRoot}api/ItemUnitOfMeasure`;
  }

  public getById(id: number, logisticSiteCode: string): Observable<EntityApi<ItemUnitOfMeasure>> {
    return this.httpClient.get<EntityApi<ItemUnitOfMeasure>>(`${this.baseApi}/${id}` +
      `?logisticSiteCode=${logisticSiteCode}`, { headers: this.headers 
      });
  }

  public add(itemUOM: ItemUnitOfMeasure, 
             logisticSiteCode: string): Observable<ItemUnitOfMeasure> {
    return this.httpClient.post<ItemUnitOfMeasure>(`${this.baseApi}` +
      `?logisticSiteCode=${logisticSiteCode}`, itemUOM);
  }

  public update(itemUOM: ItemUnitOfMeasure, 
                logisticSiteCode: string): Observable<ItemUnitOfMeasure> {
    return this.httpClient.put<ItemUnitOfMeasure>(`${this.baseApi}` +
      `?logisticSiteCode=${logisticSiteCode}`, itemUOM);
  }

  public delete(id: number, logisticSiteCode: string): Observable<ItemUnitOfMeasure> {
    return this.httpClient.delete<ItemUnitOfMeasure>(`${this.baseApi}/${id}` +
      `?logisticSiteCode=${logisticSiteCode}`, { headers: this.headers 
      });
  }
}
