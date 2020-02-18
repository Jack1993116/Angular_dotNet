import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { BaseList } from 'app/feature/base-components/classes/base-list';
import { MrpService } from '../mrp.service';
import { Demand, DemandLine } from '../Demand';

@Component({
  selector: 'app-demands-grid',
  templateUrl: './demands-grid.component.html',
  styleUrls: ['./demands-grid.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  
})
export class DemandsGridComponent 
  extends BaseList<Demand, MrpService>
  implements OnInit, AfterViewInit {

  linesDisplayedColumns = ['demandType', 'baseDocNum', 'demandLineSeq',
    'demandID', 'itemID', 'itemCode', 'quantity', 'unitCode', 
    'baseQuantity', 'baseUnitCode', 'allocated', 'softAllocated', 'hardAllocated',
    'onPlanning', 'onOrder', 'expRctQty', 'reqDueDate', 'reqWeek', 'confDueDate', 'confWeek',
    'planningTargetType', 'allocationPriority', 'planningStatusDescription'];
  expandedElement: DemandLine | null;

  constructor(public router: Router,
              public mrpService: MrpService,
              public dialog: MatDialog,
              public snacBar: MatSnackBar,
              public translateService: TranslateService) { 
    super(router, mrpService, dialog, snacBar, translateService,
      'FUSE2.DemandsGrid', ['id', 'demandSource', 'baseDocNum',
      'itemID', 'itemCode', 'baseUnitCode', 'baseQty', 'allocated',
      'onOrder', 'expRctQty', 'reqDueDate', 'reqWeek', 'confDueDate', 'confWeek',
      'allocPriority'],
      '');
  }

  ngOnInit(): void  {
    this.setColumns([]);
  }

  ngAfterViewInit(): void {
    this.getItems();
  }

  postLine(line: DemandLine): void {
    this.service.updateDemandLine(
      line.logisticSiteCode, 
      line.demandLineID,
      line.targetObjType,
      line.targetDocID,
      line.targetLineNum).subscribe(() => {
        this.getItems();
      });
  }

}
