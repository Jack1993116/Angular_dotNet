import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Constants } from 'app/constants';
import { BOM } from './BOM';


@Injectable({
  providedIn: 'root'
})
export class BOMService {

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private baseApi: string;

  constructor(private httpClient: HttpClient) { 
    this.baseApi = `${Constants.clientRoot}api/BOM`;
  }
}
