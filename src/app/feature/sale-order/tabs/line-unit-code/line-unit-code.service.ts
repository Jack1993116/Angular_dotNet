import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Constants } from 'app/constants';
import { LineUnitCode } from './LineUnitCode';

@Injectable({
  providedIn: 'root'
})
export class LineUnitCodeService {

  private baseApi: string;

  constructor(private httpClient: HttpClient) { 
    this.baseApi = `${Constants.clientRoot}api/line-unit-code`; // ?
  }
}

