import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Constants } from '../../constants';
import { Project } from './Project';
import { GetUpdateCreate, GetItem, ListItems, DeleteItem, EntityApi } from 'app/shared/interfaces';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProjectsService
  implements GetUpdateCreate<Project>,
  GetItem<Project>,
  ListItems<Project>,
  DeleteItem<Project> {

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private baseApi: string;

  constructor(private httpClient: HttpClient) { 
    this.baseApi = `${Constants.clientRoot}api/project`;
  }

  loadListResults(page: number = 0, 
                  sort: string, 
                  direction: string, 
                  searchTerm: string): Observable<EntityApi<Project>> {
    return this.loadListResultsInternal()
      .pipe(
        map(x => Object.assign(new EntityApi<Project>(), {
          items: x,
          totalCount: x.length
        }) 
      ));
  }

  loadListResultsInternal(erpCompanyID?: number): Observable<Project[]> {
    if (!erpCompanyID) {
      erpCompanyID = 1;
    }

    return this.httpClient.get<Project[]>(`${this.baseApi}/${erpCompanyID}`, {
        headers: this.headers
      });
  }
 
  getItem(param: any[]): Observable<Project> {
    return this.httpClient.get<Project>(`${this.baseApi}` +
    `/GetByProjectCode/${param[0]}?erpCompanyId=${param[1]}`, {
      headers: this.headers});
  }

  updateItem(project: Project, erpCompanyId?: number, logisticSiteCode?: string): Observable<Project> {
    return this.httpClient.put<Project>(
      `${this.baseApi}/${erpCompanyId}`, project);
  }

  createItem(project: Project, erpCompanyId?: number, logisticSiteCode?: string): Observable<Project> {
    return this.httpClient.post<Project>(
      `${this.baseApi}/${erpCompanyId}`, project);
  }

  deleteItem(project: Project, erpCompanyId?: number, logisticSiteCode?: string): Observable<any> {
    return this.httpClient.delete(`${this.baseApi}/` +
      `${project.projectCode}?erpCompanyId=${erpCompanyId}`);
  }
}
