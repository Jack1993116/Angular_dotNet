import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Constants } from '../../../constants';
import { Series } from './series';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private baseApi: string;

  constructor(private httpClient: HttpClient) { 
    this.baseApi = `${Constants.clientRoot}api/series`;
  }

  public loadListResults(objType: string,
                         erpCompanyID?: number, logisticSiteCode?: string)
                         : Observable<Series[]> {
      return this.httpClient.get<Series[]>(`${this.baseApi}?` +
        `objType=${objType}` +
        (erpCompanyID ? `&ERPCompanyId=${erpCompanyID}` : '') +
        (logisticSiteCode ? `&logisticSiteCode=${logisticSiteCode}` : ''), {
        headers: this.headers
      });
  }
}
