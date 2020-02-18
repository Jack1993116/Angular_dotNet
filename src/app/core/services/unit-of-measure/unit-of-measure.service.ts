import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { Constants } from '../../../constants';
import { UnitOfMeasure } from './UnitOfMeasure';
import { EntityApi } from 'app/shared/interfaces';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';

@Injectable({
  providedIn: 'root'
})
export class UnitOfMeasureService {

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private unitOfMeasureList: UnitOfMeasure[];
  private baseApi: string;

  constructor(private httpClient: HttpClient,
              private erpLogisticSiteService: ERPLogisticSiteService) { 
    this.baseApi = `${Constants.clientRoot}api/UnitOfMeasure`;
  }

  private ERPlogisticSiteQuery(erpCompanyId?: number,
                               logisticSiteCode?: string): string {
    const ERPCompanyIds = this.erpLogisticSiteService.getCheckedERP();
    const logisticSiteCodes = this.erpLogisticSiteService.getCheckedLogisticSiteCodes();
    return (erpCompanyId ? `ERPCompanyId=${erpCompanyId}` : 
      `ERPCompanyId=${ERPCompanyIds.map(erp => erp.erpCompanyID).join('&ERPCompanyId=')}`) +
      (logisticSiteCode ? `&logisticSiteCode=${logisticSiteCode}` :
      `&logisticSiteCode=${logisticSiteCodes.join('&logisticSiteCode=')}`);
  }

  private loadListResults(page: number = 0,
                          sort: string,
                          direction: string,
                          searchTerm: string,
                          erpCompanyId?: number,
                          logisticSiteCode?: string): Observable<EntityApi<UnitOfMeasure>> {
      return this.httpClient.get<EntityApi<UnitOfMeasure>>(
        `${this.baseApi}?` +
        `page=${page}&sortByColumnName=${sort}&orderSort=${direction}` +
        `&searchTerm=${searchTerm}&${this.ERPlogisticSiteQuery(
          erpCompanyId, logisticSiteCode)}`, {
            headers: this.headers });
  }

  public getUnitOfMeasure(): Observable<UnitOfMeasure[]> {
    if (!this.unitOfMeasureList) {
      return this.loadListResults(0, '', '', '')
        .pipe(
          map(data => data.items),
          tap(data => 
            this.unitOfMeasureList = data)
        );
    } else {
      return of(this.unitOfMeasureList);
    }
  }

  public searchUnitOfMeasure(erpCompanyId?: number,
                             logisticSiteCode?: string)
                             : Observable<UnitOfMeasure[]> {
    return this.loadListResults(0, '', '', '', erpCompanyId,
      logisticSiteCode).pipe(
        map(data => {
          return data.items;
        })
      );
  }
}
