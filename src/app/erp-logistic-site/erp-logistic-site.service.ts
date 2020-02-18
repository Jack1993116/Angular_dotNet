import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from 'rxjs';

import { Constants } from '../constants';
import { ERPCompany, ERPCompanyApi, LogisticSite, LogisticSiteApi } from './ErpLogisticSite';
import { mergeMap, tap } from 'rxjs/operators';
import { EntityApi } from 'app/shared/interfaces';
import { UnitOfMeasureService } from 'app/core/services/unit-of-measure/unit-of-measure.service';

@Injectable({
  providedIn: 'root'
})
export class ERPLogisticSiteService {
    
  private ERPList: ERPCompanyApi[];
  private logisticSiteList: LogisticSiteApi[];

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  
  constructor(private httpClient: HttpClient){
    }

  public loadERPList(): Observable<ERPCompanyApi[]>{
    return this.httpClient.get<ERPCompany[]>(`${Constants.clientRoot}api/ERPCompany`, {
      headers: this.headers
      }).pipe(
        mergeMap(data => {
          const ERPList: ERPCompanyApi[] = [];
          data.forEach(item => {
            ERPList.push(Object.assign(new ERPCompanyApi(), {
              checked: true,
              erpCompany: item
            }));
          });
          return of(ERPList);
      }));
  }

  public getERP(): Observable<ERPCompanyApi[]>{
    if (this.ERPList != null){
      return of(this.ERPList);
    } else {
      return this.loadERPList()
        .pipe(
          tap(data => 
            this.ERPList = data)
        );
    }
  }

  public getCheckedERP(erpCompanyID?: number): ERPCompany[]{
    if (this.ERPList) {
      let erps = this.ERPList.filter(erp => erp.checked === true)
        .map(({erpCompany}) => erpCompany);
      if (erpCompanyID) {
        erps = erps.filter(erp => erp.erpCompanyID === erpCompanyID);
      }
      return erps;
    } else {
      return [];
    }
  }

  public alterCheckERP(erp: ERPCompany): void {
    const erpToChange = this.ERPList.find(company => 
      (company.erpCompany.erpCompanyID === erp.erpCompanyID));
    erpToChange.checked = !erpToChange.checked;
  }

  public loadLogisticSiteList(): Observable<LogisticSiteApi[]> {
    return this.httpClient.get<EntityApi<LogisticSite>>(`${Constants.clientRoot}api/LogisticSite`, {
      headers: this.headers
      }).pipe(
        mergeMap(data => {
          const logisticSiteList: LogisticSiteApi[] = [];
          data.items.forEach(item => {
            logisticSiteList.push(Object.assign(new LogisticSiteApi(), {
              checked: true,
              logisticSite: item
            }));
          });
          return of(logisticSiteList);
      }));
      
  }

  public getLogisticSite(): Observable<LogisticSiteApi[]> {
    if (this.logisticSiteList != null){
      return of(this.logisticSiteList);
    } else {
      return this.loadLogisticSiteList()
        .pipe(
          tap(data => 
            this.logisticSiteList = data)
        );
    }
  }

  public getCheckedLogisticSites(): LogisticSite[]{
    if (this.logisticSiteList) {
      return this.logisticSiteList.filter(site => site.checked === true)
        .map(({logisticSite}) => logisticSite);
    } else {
      return [];
    }
  }

  public alterCheckLogisticSite(logisticSite: LogisticSite): void {
    const logisticSiteToChange = this.logisticSiteList.find(siteList => 
      (siteList.logisticSite.logisticSiteCode === logisticSite.logisticSiteCode));
    logisticSiteToChange.checked = !logisticSiteToChange.checked;
  }

  public getCheckedLogisticSiteCodes(): string[] {
    return this.getCheckedLogisticSites()
      .map(sites => sites.logisticSiteCode);
  }
}
