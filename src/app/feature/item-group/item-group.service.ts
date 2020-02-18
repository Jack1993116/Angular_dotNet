import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Constants } from '../../constants';
import { GetUpdateCreate, ListItems, DeleteItem, EntityApi } from 'app/shared/interfaces';
import { ItemGroup } from './ItemGroup';


@Injectable({
  providedIn: 'root'
})
export class ItemGroupService 
  implements GetUpdateCreate<ItemGroup>,
  ListItems<ItemGroup>,
  DeleteItem<ItemGroup> {

  private groups: ItemGroup[];
  headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
  });

  private baseApi: string;

  constructor(private httpClient: HttpClient) { 
    this.baseApi = `${Constants.clientRoot}api/ItemGroup`;
  }

  loadListResults(page: number, 
                  sort: string, 
                  direction: string, 
                  searchTerm: string): Observable<EntityApi<ItemGroup>> {
      return this.httpClient.get<EntityApi<ItemGroup>>(`${this.baseApi}?` +
          `page=${page}&sortByColumnName=${sort}&orderSort=${direction}` +
          `&searchTerm=${searchTerm}`, {
              headers: this.headers
          });
  }

  getItem(groupCode: number): Observable<ItemGroup> {
      return this.httpClient.get<ItemGroup>(`${this.baseApi}/${groupCode}`, {
            headers: this.headers
      });
  }

  updateItem(entity: ItemGroup, erpCompanyId?: number, 
             logisticSiteCode?: string): Observable<ItemGroup> {
      return this.httpClient.put<ItemGroup>(`${this.baseApi}`, entity);
  }

  createItem(entity: ItemGroup, erpCompanyId?: number, 
             logisticSiteCode?: string): Observable<ItemGroup> {
      return this.httpClient.post<ItemGroup>(`${this.baseApi}`, entity);
  }

  deleteItem(entity: ItemGroup, erpCompanyId?: number, 
             logisticSiteCode?: string): Observable<any> {
      return this.httpClient.delete(`${this.baseApi}/${entity.itemGroupCode}`);
  }
}
