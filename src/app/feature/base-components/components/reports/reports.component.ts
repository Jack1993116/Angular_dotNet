import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { PrintingLayout } from 'app/core/services/reports/PrintingLayout';
import { ReportsService } from 'app/core/services/reports/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportsComponent implements OnInit {

  @Input() objType: string;
  @Input() objKey: number;
  @Input() objFileNameKey: any;
  @Input() erpCompanyId?: number;
  @Input() logisticSiteCode?: string; 

  
  layouts: PrintingLayout[] = [];
  selectedLayout: number;

  constructor(private reportsService: ReportsService) { }

  ngOnInit(): void {
    this.reportsService.GetLayouts(
      this.objType, this.erpCompanyId,
      this.logisticSiteCode).subscribe(data => {
        this.layouts = data;
      });
  }

  getReport(): void {
    if (this.selectedLayout) {
      this.reportsService.getPDF(this.objType, this.objKey,
        this.erpCompanyId, this.logisticSiteCode,
        this.selectedLayout)
        .subscribe(data => {
          const link = document.createElement('a');
          link.href = 'data:application/pdf;base64,' +
            data;
          link.download = `Sale Order ${this.objFileNameKey}.pdf`;
          link.click();
        });
    }
  }

}
