import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { GetUpdateCreate, GetItem, ListItems, DeleteItem, EntityApi } from 'app/shared/interfaces';
import { Constants } from 'app/constants';
import { SaleOrder, SaleOrderLines } from './SaleOrder';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';
import { LineUnitCode } from './tabs/line-unit-code/LineUnitCode';
import { tap } from 'rxjs/operators';

export interface Attributes {
  id: number;
  name: string;
  type: string;
  editable: boolean;
  defValueNvarchar: string;
  defValueDate: Date | string | null;
  defValueNumeric: number | null;
  defValueInt: number | null;
  values: { [key: string]: string };
  translations: { [key: number]: string };
}

@Injectable({
  providedIn: 'root'
})
export class SaleOrderService implements 
  GetUpdateCreate<SaleOrder>,
  GetItem<SaleOrder>,
  ListItems<SaleOrder>,
  DeleteItem<SaleOrder> {

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private baseApi: string;
  private attributes: { [key: number]: Attributes[] };
  private lineAttributes: { [key: number]: Attributes[] };

  constructor(private httpClient: HttpClient,
              private erpLogisticSiteService: ERPLogisticSiteService){   
    
      this.baseApi = `${Constants.clientRoot}api/SaleOrderHeader`;
      this.attributes = {};
      this.lineAttributes = {};
  }

  private ERPlogisticSiteQuery(): string {
    const ERPCompanyIds = this.erpLogisticSiteService.getCheckedERP();
    return `ERPCompanyId=${ERPCompanyIds.map(erp => erp.erpCompanyID).join('&ERPCompanyId=')}`;
  }

  loadListResults(page: number = 0,
                  sort: string,
                  direction: string,
                  searchTerm: string): Observable<EntityApi<SaleOrder>> {

    sort = sort ? sort : '';
    direction = direction ? direction : '';
    searchTerm = searchTerm ? searchTerm : '';
    return this.httpClient.get<EntityApi<SaleOrder>>(`${this.baseApi}?` +
      `page=${page}&sortByColumnName=${sort}&orderSort=${direction}` +
      `&searchTerm=${searchTerm}&${this.ERPlogisticSiteQuery()}`, {
      headers: this.headers
    });
  }

  getItem(params: number[]): Observable<SaleOrder> {
    return this.httpClient.get<SaleOrder>(`${this.baseApi}/${params[0]}?` +
      `erpCompanyId=${params[1]}`, {
      headers: this.headers
    });
  }

  updateItem(saleOrder: SaleOrder, erpCompanyId?: number, 
             logisticSiteCode?: string): Observable<SaleOrder> {
    return this.httpClient.put<SaleOrder>(`${this.baseApi}?` +
      `erpCompanyId=${erpCompanyId}`, saleOrder);
  }

  createItem(saleOrder: SaleOrder, erpCompanyId?: number, 
             logisticSiteCode?: string): Observable<SaleOrder> {
    if (erpCompanyId === 0) {
      erpCompanyId = 1;
    }
    return this.httpClient.post<SaleOrder>(`${this.baseApi}?` +
      `erpCompanyId=${erpCompanyId}`, saleOrder);
  }

  deleteItem(saleOrder: SaleOrder, erpCompanyId?: number, 
             logisticSiteCode?: string): Observable<any> {
    return this.httpClient.delete(`${this.baseApi}/${saleOrder.docID}?` +
      `erpCompanyId=${erpCompanyId}`);
  }

  uploadFile(file: File, objType: string, bpCode: number,
             projectCode: string): Observable<SaleOrder> {
    const formData: FormData = new FormData();
    formData.append('file-key', file, file.name);

    return this.httpClient.post<SaleOrder>
      (`${Constants.clientRoot}api/FileUpload/Upload?` +
      `bpCode=${bpCode}&projectCode=${projectCode}` + 
      `&objType=${objType}&fileName=${file.name}`, formData);
  }

  getAttributes(erpCompanyId: number): Observable<Attributes[]> {
    if (this.attributes != null &&
        this.attributes[erpCompanyId] != null) {
      return of(this.attributes[erpCompanyId]);
    } else {
      return this.loadAttributes(erpCompanyId)
        .pipe(
          tap(data => this.attributes[erpCompanyId] = data)
        );
    }
  }

  loadAttributes(erpCompanyId: number): Observable<Attributes[]> {
    return this.httpClient.get<Attributes[]>
    (`${this.baseApi}/GetAttributes/${erpCompanyId}`, {
      headers: this.headers });
  }

  getLineAttributes(erpCompanyId: number): Observable<Attributes[]> {
    if (this.lineAttributes != null &&
        this.lineAttributes[erpCompanyId] != null) {
      return of(this.lineAttributes[erpCompanyId]);
    } else {
      return this.loadLineAttributes(erpCompanyId)
        .pipe(
          tap(data => this.lineAttributes[erpCompanyId] = data)
        );
    }
  }

  loadLineAttributes(erpCompanyId: number): Observable<Attributes[]> {
    return this.httpClient.get<Attributes[]>
    (`${this.baseApi}/GetLineAttributes/${erpCompanyId}`, {
      headers: this.headers });
  }

  updateLineUnitBreakdown(line: SaleOrderLines, erpCompanyId: number)
    : Observable<SaleOrderLines> {
      return this.httpClient.put<SaleOrderLines>
      (`${Constants.clientRoot}api/SaleOrderLine/UpdateLineUnitBreakdown` + 
      `?erpCompanyId=${erpCompanyId}`, line);
  }

  updateLineQuantityByUnitBreakdown(line: SaleOrderLines, erpCompanyId: number)
    : Observable<SaleOrderLines> {
      return this.httpClient.put<SaleOrderLines>
      (`${Constants.clientRoot}api/SaleOrderLine/UpdateLineQuantityByUnitBreakdown` + 
      `?erpCompanyId=${erpCompanyId}`, line);
  }

  updateBomBreakdown(line: SaleOrderLines, rowIndex: number, 
                     erpCompanyId: number, logisticSiteCode: string)
      : Observable<LineUnitCode> {
        return this.httpClient.put<LineUnitCode>
        (`${Constants.clientRoot}api/SaleOrderLine/UpdateBomBreakdown` +
        `?rowIndex=${rowIndex}&erpCompanyId=${erpCompanyId}` +
        `&logisticSiteCode=${logisticSiteCode}`, line);
    }
}
