import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';

import { Constants } from '../../../constants';
import { AttachmentL} from './attachment.model';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';
import { EntityApi } from 'app/shared/interfaces';

@Injectable({
    providedIn: 'root'
})
export class AttachmentService
   {

    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
    });

    private baseApi: string;

    constructor(private httpClient: HttpClient,
                private erpLogisticSiteService: ERPLogisticSiteService){

        this.baseApi = `${Constants.clientRoot}api/Attachments`;
    }

    private ERPlogisticSiteQuery(): string {
        const ERPCompanyIds = this.erpLogisticSiteService.getCheckedERP();
        const logisticSiteCode = this.erpLogisticSiteService.getCheckedLogisticSiteCodes();
        return `ERPCompanyId=${ERPCompanyIds.map(erp => erp.erpCompanyID).join('&ERPCompanyId=')}` +
            `&logisticSiteCode=${logisticSiteCode.join('&logisticSiteCode=')}`;
    }
    public getItemList(attachID: number): Observable<any> {
        return this.httpClient.get<EntityApi<AttachmentL>>(`${this.baseApi}/${attachID}?` + this.ERPlogisticSiteQuery(), {
            headers: this.headers
        });
    }
    public updateItem(item: AttachmentL, attachID: number): Observable<any> {
        return this.httpClient.put<AttachmentL>(`${this.baseApi}/${attachID}?` + this.ERPlogisticSiteQuery(), item, {
             headers: this.headers
        });
    }

    public deleteItem(attachLineID: number, erpCompanyId?: number,
                      logisticSiteCode?: string): Observable<any> {
        return this.httpClient.delete(`${this.baseApi}/${attachLineID}`);
    }

}

