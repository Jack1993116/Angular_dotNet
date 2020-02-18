import { Component, OnInit, Input, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Observable, merge, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material';

import { BusinessPartner } from 'app/business-partner/BusinessPartner';
import { BusinessPartnerService } from 'app/business-partner/business-partner-service';

@Component({
  selector: 'app-bp-search',
  templateUrl: './bp-search.component.html',
  styleUrls: ['./bp-search.component.scss']
})
export class BpSearchComponent 
  implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  form: FormGroup;
  
  public bps$: Observable<BusinessPartner[]>;
  bps: BusinessPartner[];
  subscription: Subscription;
  
  @ViewChild(MatAutocompleteTrigger, { static: false }) 
    trigger: MatAutocompleteTrigger;
    
  constructor(public businessPartnerService: BusinessPartnerService) { }

  ngOnInit(): void {
    this.bps$ = merge(this.form.controls['bpCode'].valueChanges,
      this.form.controls['bpName'].valueChanges)
      .pipe(
        debounceTime(50),
        distinctUntilChanged(),
        switchMap((term: string) => {
          let searchTermWithERP: [string, number];
          searchTermWithERP = this.form.get('erpCompany').value ? 
            [term, this.form.get('erpCompany').value] :
            [term, null];
          return this.businessPartnerService.searchBps(searchTermWithERP);
          }
        ),
        tap(data => {
          this.bps = data;
        })
    );
  }

  ngAfterViewInit(): void {
    this._subscribeToClosingActions();
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  private _subscribeToClosingActions(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.trigger.panelClosingActions
      .subscribe(e => {
        if (this.bps && this.bps.length === 1) {
          this.form.controls['bpName'].setValue(this.bps[0].bpName);
          this.form.controls['bpCode'].setValue(this.bps[0].bpCode);
        } else if (!this.form.pristine) {
            if (!e || !e.source) {
            this.form.controls['bpName'].setValue(null);
            this.form.controls['bpCode'].setValue(null);
          }
        }
      },
      err => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions());
  }

  selectBp(event: MatAutocompleteSelectedEvent): void {
    this.form.controls['bpName'].setValue(event.option.value['bpName']);
    this.form.controls['bpCode'].setValue(event.option.value['bpCode']);
  }

}
