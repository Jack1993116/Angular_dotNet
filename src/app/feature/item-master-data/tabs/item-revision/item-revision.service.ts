import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Constants } from 'app/constants';
import { ItemRevision } from './ItemRevision';
import { EntityApi } from 'app/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ItemRevisionService {

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private baseApi: string;

  constructor(private httpClient: HttpClient) { 
    this.baseApi = `${Constants.clientRoot}api/ItemRevision`;
  }

  public getItemRevisionByItemId(itemId: number): Observable<EntityApi<ItemRevision>> {
    return this.httpClient.get<EntityApi<ItemRevision>>
      (`${this.baseApi}/GetByItemId/${itemId}`, { headers: this.headers });
  }
}
