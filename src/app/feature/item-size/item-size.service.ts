import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Constants } from '../../constants';
import { ItemSize } from './ItemSize';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';
import { GetUpdateCreate, GetItem, ListItems, DeleteItem, EntityApi } from 'app/shared/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ItemSizeService 
    implements GetUpdateCreate<ItemSize>,
    GetItem<ItemSize>,
    ListItems<ItemSize>,
    DeleteItem<ItemSize> {

    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
    });

    private itemSizeList: ItemSize[];
    private baseApi: string;
    constructor(private httpClient: HttpClient) {
        this.baseApi = `${Constants.clientRoot}api/ItemSize`;
    }

    loadListResults(page: number, sort: string, 
                    direction: string, searchTerm: string)
        : Observable<EntityApi<ItemSize>> {
            return this.httpClient.get<EntityApi<ItemSize>>(`${this.baseApi}?` +
            `page=${page}&sortByColumnName=${sort}&orderSort=${direction}` +
            `&searchTerm=${searchTerm}`, {
            headers: this.headers });
    }
    
    getItemSizes(): Observable<ItemSize[]> {
        if (!this.itemSizeList) {
            return this.loadListResults(0, '', '', '')
              .pipe(
                map(data => data.items),
                tap(data => 
                  this.itemSizeList = data)
              );
          } else {
            return of(this.itemSizeList);
          }
    }

    getItem(param: any[]): Observable<ItemSize> {
        return this.httpClient.get<ItemSize>(`${this.baseApi}/${param[0]}`, {
            headers: this.headers });
    }

    updateItem(entity: ItemSize, erpCompanyId?: number, logisticSiteCode?: string): Observable<ItemSize> {
        return this.httpClient.put<ItemSize>(`${this.baseApi}`, entity);
    }

    createItem(entity: ItemSize, erpCompanyId?: number, logisticSiteCode?: string): Observable<ItemSize> {
        return this.httpClient.post<ItemSize>(`${this.baseApi}`, entity);
    }

    deleteItem(entity: ItemSize, erpCompanyId?: number, logisticSiteCode?: string): Observable<any> {
        return this.httpClient.delete(`${this.baseApi}/${entity.sizeID}`);
    } 
}
