import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Constants } from '../../../constants';
import { PrintingLayout } from './PrintingLayout';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private baseApi: string;

  constructor(private httpClient: HttpClient) { 
    this.baseApi = `${Constants.clientRoot}api/reports`;
  }

  public getPDF(objType: string, objKey: number,
                erpCompanyId: number, logisticSiteCode: string,
                loayoutId: number): Observable<string> {
    return this.httpClient.get<string>(`${this.baseApi}/GetPdf?` +
      `objType=${objType}&objKey=${objKey}&loayoutId=${loayoutId}` +
      (erpCompanyId ? `&erpCompanyId=${erpCompanyId}` : '') +
      (logisticSiteCode ? `&logisticSiteCode=${logisticSiteCode}` : '')
      , { headers: this.headers });
  }

  public GetLayouts(objType: string,
                    erpCompanyId: number, logisticSiteCode: string)
                    : Observable<PrintingLayout[]> {
      return this.httpClient.get<PrintingLayout[]>
      (`${this.baseApi}/GetLayouts?objType=${objType}` +
        (erpCompanyId ? `&erpCompanyId=${erpCompanyId}` : '') +
        (logisticSiteCode ? `&logisticSiteCode=${logisticSiteCode}` : '')
      , { headers: this.headers });
  }
}
