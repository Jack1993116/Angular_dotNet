import { Pipe, PipeTransform } from '@angular/core';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';
import { ERPCompanyApi } from 'app/erp-logistic-site/ErpLogisticSite';

@Pipe({
  name: 'erps'
})
export class ErpsPipe implements PipeTransform {


  constructor(private erpLogisticSiteService: ERPLogisticSiteService) {

  }
  transform(erpCompanyId: number, ...args: any[]): string {
    let erps: ERPCompanyApi[];
    this.erpLogisticSiteService.getERP()
    .subscribe(data => {
      erps = data;
    });
    const item = erps.filter
      (erp => erp.erpCompany.erpCompanyID === erpCompanyId)[0];
    if (item) { return item.erpCompany.erpCompanyName; }
  }

}
