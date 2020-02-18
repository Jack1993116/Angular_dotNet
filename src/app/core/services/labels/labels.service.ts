import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';

import { Constants } from '../../../constants';
import { Label } from './Label';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';
import { ListItems, EntityApi, DeleteItem } from 'app/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LabelsService {

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private baseApi: string;

  constructor(private httpClient: HttpClient,
              private erpLogisticSiteService: ERPLogisticSiteService){   
              
              this.baseApi = `${Constants.clientRoot}api/Label`;
  }

  private ERPlogisticSiteQuery(): string {
    const logisticSiteCode = this.erpLogisticSiteService.getCheckedLogisticSiteCodes();
    return `logisticSiteCode=${logisticSiteCode.join('&logisticSiteCode=')}`;
}

  loadListResults(): Observable<EntityApi<Label>> {
    return this.httpClient.get<EntityApi<Label>>(`${this.baseApi}?` +
      `${this.ERPlogisticSiteQuery()}`, {
        headers: this.headers
    });
  }

}
