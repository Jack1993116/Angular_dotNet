import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { mergeMap, tap, map } from 'rxjs/operators';
import { Constants } from '../constants';
import { BusinessPartner, BusinessPartnerApi } from './BusinessPartner';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessPartnerService {

    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
    });

    private baseApi: string;

    constructor(private httpClient: HttpClient,
                private erpLogisticSiteService: ERPLogisticSiteService){

        this.baseApi = `${Constants.clientRoot}api/BusinessPartner`;
    }

    private ERPlogisticSiteQuery(): string {
        const ERPCompanyIds = this.erpLogisticSiteService.getCheckedERP();
        return `ERPCompanyId=${ERPCompanyIds.map(erp => erp.erpCompanyID).join('&ERPCompanyId=')}`;
    }

    public loadListResults(page: number = 0,
                           sort: string,
                           direction: string,
                           searchTerm: string,
                           erpCompanyID?: number,
                           active?: boolean,
                           salesModule?: boolean,
                           purchaseModule?: boolean): Observable<BusinessPartnerApi> {
      return this.httpClient.get<BusinessPartnerApi>(`${this.baseApi}?` +
        `page=${page}&sortByColumnName=${sort}&orderSort=${direction}` +
        `&searchTerm=${searchTerm}` +
        (erpCompanyID ? `&ERPCompanyId=${erpCompanyID}` :
          `&${this.ERPlogisticSiteQuery()}`) +
        (active !== null ? `&active=${active}` : '') +
        (salesModule !== null ? `&salesModule=${salesModule}` : '') +
        (salesModule !== null ? `&salesModule=${salesModule}` : ''), {
        headers: this.headers
      });
    }

    searchBps(term: [string, number]): Observable<BusinessPartner[]> {
      return this.loadListResults(1, '', '', term[0], term[1], true, true)
        .pipe(
          map(data => {
            return data.items;
          })
        );

    }
}
