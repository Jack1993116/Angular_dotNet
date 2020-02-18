import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-delete-confirmtion',
    template: `
            <div mat-dialog-content>
                    <p>{{ 'DEL_SURE' | translate }}</p>
            </div>
            <div mat-dialog-actions>
                <button mat-button [mat-dialog-close]="false" color="accent" cdkFocusInitial>
                {{ 'CANCEL' | translate }} <mat-icon>arrow_back</mat-icon> </button>
                <button mat-button [mat-dialog-close]="true" color="warn">
                {{ 'DELETE' | translate }} <mat-icon>cancel</mat-icon> </button>
            </div>`,
  })

  export class DialogDeleteConfirmtionComponent {

    constructor(
      public dialogRef: MatDialogRef<DialogDeleteConfirmtionComponent>) {}
}
