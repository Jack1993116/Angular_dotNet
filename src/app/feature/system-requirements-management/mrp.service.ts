import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GetUpdateCreate, GetItem, ListItems, DeleteItem, EntityApi } from 'app/shared/interfaces';
import { Constants } from 'app/constants';
import { Demand, DemandLine} from './Demand';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';


@Injectable({
  providedIn: 'root'
})
export class MrpService
 implements ListItems<Demand>,
 DeleteItem<Demand> {
  
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private baseApi: string;

  constructor(private httpClient: HttpClient,
              private erpLogisticSiteService: ERPLogisticSiteService) {
    this.baseApi = `${Constants.clientRoot}api/MRP`; 
  }

  private ERPlogisticSiteQuery(): string {
    const ERPCompanyIds = this.erpLogisticSiteService.getCheckedERP();
    const logisticSiteCode = this.erpLogisticSiteService.getCheckedLogisticSiteCodes();
    return `ERPCompanyId=${ERPCompanyIds.map(erp => erp.erpCompanyID).join('&ERPCompanyId=')}` +
        `&logisticSiteCode=${logisticSiteCode.join('&logisticSiteCode=')}`;
  }

  loadListResults(page: number = 0,
                  sort: string,
                  direction: string,
                  searchTerm: string): Observable<EntityApi<Demand>> {

    return this.httpClient.get<EntityApi<Demand>>(`${this.baseApi}/Demands?` +
      `page=${page}&sortByColumnName=${sort}&orderSort=${direction}` +
      `&searchTerm=${searchTerm}&${this.ERPlogisticSiteQuery()}`, {
      headers: this.headers
    });
  }

  getAllDemandLines(logisticSiteCode: string, erpCompanyId: number, page: number = 0)
    : Observable<EntityApi<DemandLine>> {
    return this.httpClient.get<EntityApi<DemandLine>>(`${this.baseApi}?` +
      `page=${page}&erpCompanyId=${erpCompanyId}&logisticSiteCode=${logisticSiteCode}`, {
        headers: this.headers
    });
  }

  updateDemandLine(logisticSiteCode: string,
                   demandLineId: number,
                   targetObjType: string,
                   targetDocId: number,
                   targetLineId: number) 
    : Observable<any> {
      return this.httpClient.post<any>(`${this.baseApi}/${demandLineId}?` +
        `logisticSiteCode=${logisticSiteCode}` +
        ((targetDocId !== null && targetLineId !== null && targetObjType !== null) ?
        `&targetObjType=${targetObjType}&targetDocId=${targetDocId}` +
        `&targetLineId=${targetLineId}` : ''), {});
    }

    deleteItem(entity: Demand, erpCompanyId?: number, logisticSiteCode?: string): Observable<any> {
      throw new Error('Method not implemented.');
    }


}
