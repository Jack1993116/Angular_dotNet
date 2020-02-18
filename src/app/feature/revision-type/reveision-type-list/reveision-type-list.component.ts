import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { BaseList } from 'app/feature/base-components/classes/base-list';

import { ReveisionType } from '../ReveisionType';
import { DialogDeleteConfirmtionComponent } from 'app/shared/components/dialog-delete-confirmtion/dialog-delete-confirmtion.component';
import { ReveisionTypeService } from '../reveision-type.service';

@Component({
  selector: 'app-reveision-type-list',
  templateUrl: './reveision-type-list.component.html',
  styleUrls: ['./reveision-type-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReveisionTypeListComponent 
  extends BaseList<ReveisionType, ReveisionTypeService>
  implements OnInit, AfterViewInit {

constructor(public router: Router,
            public reveisionService: ReveisionTypeService,
            public dialog: MatDialog,
            public snacBar: MatSnackBar,
            public translateService: TranslateService) {
    super(router, reveisionService, dialog, snacBar, translateService,
        'FUSE2.ReveisionType', ['revTypeID', 'revTypeName', 'delete'],
        'reveision-type/create');
}

ngOnInit(): void {
    this.setColumns(['revTypeID', 'delete']);
}

ngAfterViewInit(): void {
    this.getItems();
}   

delete(item: ReveisionType): void {
    this.openDialog().subscribe(result => {
        if (result === true) {
            super.delete(item, 'REV_TYPE_DELETED', 'revTypeName');
        }
    });   
}

openDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(DialogDeleteConfirmtionComponent, {
        minWidth: '250px'
    });

    return dialogRef.afterClosed();
}
}
