import { Component, OnInit , ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core';
import { Attachment, AttachmentL} from './attachment.model';
import { AttachmentService } from './attachment.service';
import { DialogDeleteConfirmtionComponent } from 'app/shared/components/dialog-delete-confirmtion/dialog-delete-confirmtion.component';
import { AttachmentDialogComponent } from './attachment-dialog/attachment-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Observable} from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from './i18n/en';
import { locale as hebrew } from './i18n/he';
import { BaseParent } from 'app/feature/base-components/classes/base-parent';
import { UnitOfMeasureService } from 'app/core/services/unit-of-measure/unit-of-measure.service';


const DUMMY_DATA: AttachmentL[] = [
    {
        attachLineID: 1,
        fileName: 'Attached documentation',
        fileURL: 'http://fileattachede.com/file.pdf',
        fileType: 'PDF',
        createDate: '15/01/2020',
        comment: 'Some Comment'
    },
    {
        attachLineID: 2,
        fileName: 'Attached documentation',
        fileURL: 'http://fileattachede.com/file.pdf',
        fileType: 'PDF',
        createDate: '15/01/2020',
        comment: 'Some Comment'
    },
    {
        attachLineID: 3,
        fileName: 'Attached documentation',
        fileURL: 'http://fileattachede.com/file.pdf',
        fileType: 'PDF',
        createDate: '15/01/2020',
        comment: 'Some Comment'
    },


];

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent implements OnInit {
  @Input() attachID: number;
  // emit new event when attachId is newly  created
  @Output() attachIdChanged = new EventEmitter<number>();


  displayedColumns: string[] = ['attachLineID', 'fileName', 'fileURL', 'fileType', 'createDate', 'comment', 'edit', 'delete'];
  dataSource = DUMMY_DATA;
  dialogRef: any;

    constructor(public attachmentService: AttachmentService, 
                public dialog: MatDialog, public snacBar: MatSnackBar, 
                public translate: TranslateService,
                private fuseTranslationLoaderService: FuseTranslationLoaderService) {
        this.fuseTranslationLoaderService.loadTranslations(english, hebrew);

  }

  ngOnInit(): void {
    if (this.attachID){
        this.getItemList();
    }
  }

  editAttachLine(item: AttachmentL): void {
    this.dialogRef = this.dialog.open(AttachmentDialogComponent, {
        panelClass: 'attachment-dialog',
        data      : {
            attachmentL: item,
        }
    });
    this.dialogRef.afterClosed()
        .subscribe(response => {
            if (!response ) {
                return false;
            }
            this.attachmentService.updateItem(response, this.attachID).subscribe( res => {
                this.getItemList();
                this.snacBar.open(`${this.translate.instant('LINE_UPDATED')}`, 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });
        });
    });
  }

  deleteAttachLine(attachLineID: number): void {
      this.openDeleteDialog().subscribe(result => {
          if (result === true) {
              this.attachmentService.deleteItem(attachLineID).subscribe( data => {
                  this.getItemList();
                  this.snacBar.open(`${this.translate.instant('LINE_DELETED')}`, null, {
                      duration: 2000,
                      verticalPosition: 'top'
                  });
              });
          }
      });
  }

  openDeleteDialog(): Observable<boolean> {
        const dialogRef = this.dialog.open(DialogDeleteConfirmtionComponent, {
            minWidth: '250px'
        });
        return dialogRef.afterClosed();
  }
  getItemList(): void{
      this.attachmentService.getItemList(this.attachID)
        .subscribe(data => {
          // this.dataSource = data.items;
          console.log(data);
      });
  }

}
