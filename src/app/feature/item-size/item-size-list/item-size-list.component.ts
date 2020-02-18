import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { BaseList } from 'app/feature/base-components/classes/base-list';
import { ItemSizeService } from '../item-size.service';
import { ItemSize } from '../ItemSize';
import { DialogDeleteConfirmtionComponent } from 'app/shared/components/dialog-delete-confirmtion/dialog-delete-confirmtion.component';

@Component({
    selector: 'app-item-size-list',
    templateUrl: './item-size-list.component.html',
    styleUrls: ['./item-size-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ItemSizeListComponent 
    extends BaseList<ItemSize, ItemSizeService>
    implements OnInit, AfterViewInit {

    constructor(public router: Router,
                public itemService: ItemSizeService,
                public dialog: MatDialog,
                public snacBar: MatSnackBar,
                public translateService: TranslateService) {
        super(router, itemService, dialog, snacBar, translateService,
            'FUSE2.ItemSize', ['sizeID', 'sizeName', 'size',
            'unitCode', 'delete'],
            'item-size/create');
    }
    
    ngOnInit(): void {
        this.setColumns(['sizeID', 'delete']);
    }

    ngAfterViewInit(): void {
        this.getItems();
    }   

    delete(item: ItemSize): void {
        this.openDialog().subscribe(result => {
            if (result === true) {
                super.delete(item, 'ITEM_SIZE_DELETED', 'sizeName');
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
