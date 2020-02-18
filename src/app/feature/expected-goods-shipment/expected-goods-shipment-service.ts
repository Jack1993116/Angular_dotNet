import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GetUpdateCreate, GetItem, ListItems, DeleteItem, EntityApi } from 'app/shared/interfaces';
import { ExpectedGoodsShipment, ExpectedGoodsShipmentLines, CompatibleLine, ExtendedExpectedGoodsShipmentL } from './ExpectedGoodsShipment';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';
import { Constants } from 'app/constants';
import { SaleOrderLines, SaleOrder } from '../sale-order/SaleOrder';

@Injectable({
  providedIn: 'root'
})
export class ExpectedGoodsShipmentService implements 
    GetUpdateCreate<ExpectedGoodsShipment>, 
    GetItem<ExpectedGoodsShipment>,
    ListItems<ExpectedGoodsShipment>,
    DeleteItem<ExpectedGoodsShipment> { 

    headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    private baseApi: string;

  constructor(private httpClient: HttpClient,
              private erpLogisticSiteService: ERPLogisticSiteService) { 
    this.baseApi = `${Constants.clientRoot}api/ExpectedGoodsShipment`;
  }

  private ERPlogisticSiteQuery(): string {
    const logisticSiteCode = this.erpLogisticSiteService.getCheckedLogisticSiteCodes();
    return `logisticSiteCode=${logisticSiteCode.join('&logisticSiteCode=')}`;
  }

  loadListResults(page: number, sort: string, direction: string, searchTerm: string)
  : Observable<EntityApi<ExpectedGoodsShipment>> {
    return this.httpClient
      .get<EntityApi<ExpectedGoodsShipment>>(`${this.baseApi}?` +
      `page=${page}&sortByColumnName=${sort}&orderSort=${direction}` +
      `&searchTerm=${searchTerm}&${this.ERPlogisticSiteQuery()}`, {
        headers: this.headers
      });
  }

  getItem(params: any[]): Observable<ExpectedGoodsShipment> {
    return this.httpClient.get<ExpectedGoodsShipment>(`${this.baseApi}/${params[0]}?` +
      `logisticSiteCode=${params[1]}`, {
        headers: this.headers
    });
  }

  updateItem(expectedGoodsShip: ExpectedGoodsShipment, erpCompanyId?: number, 
             logisticSiteCode?: string): Observable<ExpectedGoodsShipment> {
    return this.httpClient.put<ExpectedGoodsShipment>(`${this.baseApi}?` +
      `logisticSiteCode=${logisticSiteCode}`, expectedGoodsShip);
  }

  createItem(expectedGoodsShip: ExpectedGoodsShipment, erpCompanyId?: number,
             logisticSiteCode?: string, runMrp: boolean = false): Observable<ExpectedGoodsShipment> {
    return this.httpClient.post<ExpectedGoodsShipment>(`${this.baseApi}?` +
      `logisticSiteCode=${logisticSiteCode}&runMrp=${runMrp}`, 
      expectedGoodsShip);
  }

  deleteItem(expectedGoodsShip: ExpectedGoodsShipment, erpCompanyId?: number, 
             logisticSiteCode?: string): Observable<any> {
    return this.httpClient.delete(`${this.baseApi}/${expectedGoodsShip.docID}?` +
      `logisticSiteCode=${logisticSiteCode}`);
  }

  getBySaleOrder(saleOrderDocId: number, erpCompanyID: number)
    : Observable<EntityApi<ExtendedExpectedGoodsShipmentL>> {
    return this.httpClient.get<EntityApi<ExtendedExpectedGoodsShipmentL>>
      (`${this.baseApi}/SO/${saleOrderDocId}?erpCompanyID=${erpCompanyID}`);
  }

  getBySaleOrderLine(lineId: number, logisticSiteCode: string)
    : Observable<EntityApi<ExtendedExpectedGoodsShipmentL>> {
    return this.httpClient.get<EntityApi<ExtendedExpectedGoodsShipmentL>>
      (`${this.baseApi}/SOL/${lineId}?logisticSiteCode=${logisticSiteCode}`);
  }

  updateSaleOrderByExpectedGoodsLines(expectedGoodsLines: ExpectedGoodsShipmentLines[])
    : Observable<SaleOrder> {
      return this.httpClient.put<SaleOrder>
        (`${this.baseApi}/UpdateSaleOrderByExpectedGoodsLines`, 
        expectedGoodsLines);
  }

  updateSaleOrderLineByExpectedGoodsLines(expectedGoodsLines: ExpectedGoodsShipmentLines[])
    : Observable<SaleOrderLines> {
    return this.httpClient.put<SaleOrderLines>
      (`${this.baseApi}/UpdateSaleOrderLineByExpectedGoodsLines`, 
        expectedGoodsLines);
  }

  getExpectedShipmentDraftLines(): Observable<EntityApi<CompatibleLine>> {
    return this.httpClient.get<EntityApi<CompatibleLine>>
      (`${this.baseApi}/GetCompatibleLines?${this.CL_ERPlogisticSiteQuery()}`, {
        headers: this.headers});
  }

  private CL_ERPlogisticSiteQuery(): string {
    const logisticSiteCode = this.erpLogisticSiteService.getCheckedLogisticSiteCodes();
    const erpCompaniesId = this.erpLogisticSiteService
      .getCheckedERP().map(erp => erp.erpCompanyID);
    return `ERPCompanyId=${erpCompaniesId.join('&ERPCompanyId=')}` +
    `&logisticSiteCode=${logisticSiteCode.join('&logisticSiteCode=')}`;
  }

}
