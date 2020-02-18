import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';

import { Constants } from '../../constants';
import { Location, LogisticLocation } from './Location';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';
import { ListItems, EntityApi, DeleteItem } from 'app/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LocationsService 
  implements ListItems<Location>,
  DeleteItem<Location> {

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private baseApi: string;

  constructor(private httpClient: HttpClient,
              private erpLogisticSiteService: ERPLogisticSiteService){   
              
              this.baseApi = `${Constants.clientRoot}api/Location`;
  }

  private ERPlogisticSiteQuery(): string {
    const logisticSiteCode = this.erpLogisticSiteService.getCheckedLogisticSiteCodes();
    return `logisticSiteCode=${logisticSiteCode.join('&logisticSiteCode=')}`;
  }

  loadListResults(page: number, 
                  sort: string, 
                  direction: string, 
                  searchTerm: string): Observable<EntityApi<Location>> {
    return this.httpClient.get<EntityApi<Location>>(`${this.baseApi}?` +
      `${this.ERPlogisticSiteQuery()}`, {
        headers: this.headers
    });
  }

  deleteItem(entity: Location, erpCompanyId?: number, logisticSiteCode?: string): Observable<any> {
    throw new Error('Method not implemented.');
  }

  printLocations(locations: LogisticLocation, labelId: number, printerId: number): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.baseApi}/print?` + 
      `labelId=${labelId}&printerId=${printerId}`, { locations });
  }

}

