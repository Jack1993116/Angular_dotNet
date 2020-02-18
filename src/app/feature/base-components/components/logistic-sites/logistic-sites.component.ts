import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ControlContainer, FormGroupName, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';


@Component({
  selector: 'app-logistic-sites',
  templateUrl: './logistic-sites.component.html',
  styleUrls: ['./logistic-sites.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }]
})
export class LogisticSitesComponent 
  implements OnInit, AfterViewInit {

  @Input()
  fatherForm: FormGroup;
  @Input()
  form: FormGroup;
  @Input()
  bpCode: number;
  logisticSites: string[] = [];
  
  constructor(private erpLogisticSiteService: ERPLogisticSiteService) { }

  ngOnInit(): void {
    this.logisticSites = this.erpLogisticSiteService
                .getCheckedLogisticSiteCodes();

    if (this.logisticSites.length === 1 &&
        (!this.form.controls['logisticSiteCode'].value ||
        typeof this.form.controls['logisticSiteCode'].value === 'object')) {
      this.form.controls['logisticSiteCode'].setValue(
        this.logisticSites[0]);
    }

    this.checkEnableDisable();
    this.fatherForm.controls['bpCode'].valueChanges
      .pipe(
        debounceTime(50), 
        distinctUntilChanged())
        .subscribe(() => {
          this.checkEnableDisable();
      });
  }
  

  private checkEnableDisable(): void {
    if (this.fatherForm.controls['bpCode'].value &&
      this.form.enabled) {
      if (this.form.controls['logisticSiteCode'].disabled) {
        this.form.controls['logisticSiteCode'].enable();
      }
    }
    else if (this.form.controls['logisticSiteCode'].enabled) {
      this.form.controls['logisticSiteCode'].disable();
    }
  }

  ngAfterViewInit(): void {
    
  }
}
