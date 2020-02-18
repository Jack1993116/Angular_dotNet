import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Constants } from '../../constants';
import { ReveisionType } from './ReveisionType';
import { GetUpdateCreate, GetItem, ListItems, DeleteItem, EntityApi } from 'app/shared/interfaces';


@Injectable({
  providedIn: 'root'
})
export class ReveisionTypeService 
  implements GetUpdateCreate<ReveisionType>,
  GetItem<ReveisionType>,
  ListItems<ReveisionType>,
  DeleteItem<ReveisionType> {
  constructor(private httpClient: HttpClient) {
    this.baseApi = `${Constants.clientRoot}api/RevisionType`;
  }

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private reveisionTypes: ReveisionType[];
  private baseApi: string;

  loadListResults(page: number, sort: string, 
                  direction: string, searchTerm: string)
    : Observable<EntityApi<ReveisionType>> {
    return this.httpClient.get<EntityApi<ReveisionType>>(`${this.baseApi}?` +
      `page=${page}&sortByColumnName=${sort}&orderSort=${direction}` +
      `&searchTerm=${searchTerm}`, {
      headers: this.headers });
  }

  getReveisionType(): Observable<ReveisionType[]> {
    if (!this.reveisionTypes) {
        return this.loadListResults(0, '', '', '')
          .pipe(
            map(data => data.items),
            tap(data => 
              this.reveisionTypes = data)
          );
      } else {
        return of(this.reveisionTypes);
      }
  }

  getItem(param: any[]): Observable<ReveisionType> {
    return this.httpClient.get<ReveisionType>(`${this.baseApi}/${param[0]}`, {
      headers: this.headers });
  }

  updateItem(entity: ReveisionType, erpCompanyId?: number, logisticSiteCode?: string): Observable<ReveisionType> {
    return this.httpClient.put<ReveisionType>(`${this.baseApi}`, entity);
  }

  createItem(entity: ReveisionType, erpCompanyId?: number, logisticSiteCode?: string): Observable<ReveisionType> {
    return this.httpClient.post<ReveisionType>(`${this.baseApi}`, entity);

  }
  
  deleteItem(entity: ReveisionType, erpCompanyId?: number, logisticSiteCode?: string): Observable<any> {
    return this.httpClient.delete(`${this.baseApi}/${entity.revTypeID}`);
  }
}
