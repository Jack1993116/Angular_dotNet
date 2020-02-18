import { Component, OnInit, Input } from '@angular/core';
import {  switchMap,  } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

import { Currency } from 'app/core/services/currency/Currency';
import { CurrencyService } from 'app/core/services/currency/currency.service';
import { Subject, Observable } from 'rxjs';


@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss']
})
export class CurrenciesComponent implements OnInit {

  @Input()
  form: FormGroup;
  currencySubject = new Subject<Currency[]>();
  currency$ = this.currencySubject.asObservable();
  iscurrencyFromService = false;

  constructor(private currencyService: CurrencyService) { }

  ngOnInit(): void {
    if (this.form.controls['erpCompany'].value) {
      this.getCurrencyFromService
        (this.form.controls['erpCompany'].value)
        .subscribe(this.emitNewValue());
    }

    this.form.controls['erpCompany'].valueChanges
      .pipe(
        switchMap((term: number) => {
          return this.getCurrencyFromService(term);
        })).subscribe(this.emitNewValue());
    
  }

  getUnitsFromServiceIfNeeded(): void {
    if (!this.iscurrencyFromService) {
      this.getCurrencyFromService(
        this.form.controls['erpCompany'].value)
      .subscribe(this.emitNewValue());
    }
  }

  getCurrencyFromService(term: number): Observable<Currency[]> {
    this.iscurrencyFromService = true;
    return this.currencyService.loadListResults(term); 
  }

  emitNewValue(): (value: Currency[]) => void {
    return data => {
      if (data) {
        this.currencySubject.next(data);
        if (data.length === 1) {
          this.form.controls['curCode'].setValue(data[0].curCode);
        }
      }
    };
  }
}
