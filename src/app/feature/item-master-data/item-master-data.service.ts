import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';

import { Constants } from '../../constants';
import { ItemMasterData } from './ItemMasterData';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';
import { GetUpdateCreate, GetItem, ListItems, DeleteItem, EntityApi } from 'app/shared/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ItemMasterDataService 
    implements GetUpdateCreate<ItemMasterData>,
    GetItem<ItemMasterData>,
    ListItems<ItemMasterData>,
    DeleteItem<ItemMasterData> { 

    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
    });

    private baseApi: string;

    constructor(private httpClient: HttpClient,
                private erpLogisticSiteService: ERPLogisticSiteService){   
                
                this.baseApi = `${Constants.clientRoot}api/ItemMasterData`;
    }
    
    private ERPlogisticSiteQuery(): string {
        const ERPCompanyIds = this.erpLogisticSiteService.getCheckedERP();
        const logisticSiteCode = this.erpLogisticSiteService.getCheckedLogisticSiteCodes();
        return `ERPCompanyId=${ERPCompanyIds.map(erp => erp.erpCompanyID).join('&ERPCompanyId=')}` +
            `&logisticSiteCode=${logisticSiteCode.join('&logisticSiteCode=')}`;
    }

    public loadListResults(page: number = 0,
                           sort: string,
                           direction: string,
                           searchTerm: string,
                           saleItem?: boolean,
                           purchaseItem?: boolean): Observable<EntityApi<ItemMasterData>> {

        return this.httpClient.get<EntityApi<ItemMasterData>>(`${this.baseApi}?` +
            `page=${page}&sortByColumnName=${sort}&orderSort=${direction}` +
            `&searchTerm=${searchTerm}&${this.ERPlogisticSiteQuery()}` + 
            (saleItem ? `&saleItem=${saleItem}` : ``) +
            (purchaseItem ? `&purchaseItem=${purchaseItem}` : ``), {
            headers: this.headers
        });
    }

    public getItem(param: number[]): Observable<ItemMasterData> {
        return this.httpClient.get<ItemMasterData>(`${this.baseApi}/${param[0]}`, {
            headers: this.headers
        });
    }

    public updateItem(item: ItemMasterData, erpCompanyId?: number, 
                      logisticSiteCode?: string): Observable<any> { 
        return this.httpClient.put<ItemMasterData>(`${this.baseApi}`, item);
    }

    public createItem(item: ItemMasterData, erpCompanyId?: number, 
                      logisticSiteCode?: string): Observable<any> {      
        return this.httpClient.post<ItemMasterData>(`${this.baseApi}`, item);
    }

    public deleteItem(item: ItemMasterData, erpCompanyId?: number, 
                      logisticSiteCode?: string): Observable<any> {
        return this.httpClient.delete(`${this.baseApi}/${item.itemID}`);
    }

    public AddItemToLogisticSite(id: number, logisticSiteCode: string): Observable<any> {
        return this.httpClient.get<any>(`${this.baseApi}/AddItemToLogisticSite/${id}` +
         `?logisticSiteCode=${logisticSiteCode}`, { headers: this.headers
        });
    }

    public RemoveItemFromLogisticSite(id: number, logisticSiteCode: string): Observable<any> {
        return this.httpClient.get<any>(`${this.baseApi}/RemoveItemFromLogisticSite/${id}` +
         `?logisticSiteCode=${logisticSiteCode}`, { headers: this.headers
        });
    }

    public AddItemToERPCompany(id: number, erpCompanyId: number): Observable<any> {
        return this.httpClient.get<any>(`${this.baseApi}/AddItemToERPCompany/${id}` +
         `?erpCompanyId=${erpCompanyId}`, { headers: this.headers
        });
    }

    public RemoveItemFromERPCompany(id: number, erpCompanyId: number): Observable<any> {
        return this.httpClient.get<any>(`${this.baseApi}/RemoveItemFromERPCompany/${id}` +
         `?erpCompanyId=${erpCompanyId}`, { headers: this.headers
        });
    }

    public searchItems(term: string, saleItem?: boolean,
                       purchaseItem?: boolean): Observable<ItemMasterData[]> {
        if (!term || !term.trim()) {
            return of([]);
        }

        return this.loadListResults(1, '', '', term, saleItem, purchaseItem)
            .pipe(
                map(data => {
                    return data.items;
                })
            );
    }

    public searchItemsBOM(
        parentUnitId: number, erpCompanyId: number,
        logisticSiteCode: string, searchTerm: string): Observable<ItemMasterData[]> {
        return this.httpClient.get<ItemMasterData[]>(
            `${Constants.clientRoot}api/SaleOrderLine/GetCompatibleChildren` +
            `?parentUnitId=${parentUnitId}&erpCompanyId=${erpCompanyId}` +
            `&logisticSiteCode=${logisticSiteCode}&searchTerm=${searchTerm}`, { headers: this.headers
            });
    }
}

