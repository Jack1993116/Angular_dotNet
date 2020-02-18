import {Component, OnInit, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ValidationErrors, ValidatorFn, AbstractControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {takeUntil} from 'rxjs/operators';
import {AttachmentL} from '../attachment.model';

@Component({
    selector: 'app-attachment-dialog',
    templateUrl: './attachment-dialog.component.html',
    styleUrls: ['./attachment-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class  AttachmentDialogComponent {

    attachmentDialogForm: FormGroup;
    attachmentL: AttachmentL;

    /**
     * Constructor
     *
     * @param {MatDialogRef<AttachmentDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */

    constructor(
        public matDialogRef: MatDialogRef<AttachmentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,      

    )
    {
        // Set the defaults
        this.attachmentL = _data.attachmentL;
        this.attachmentDialogForm = this._formBuilder.group({
            fileName : [this.attachmentL.fileName, Validators.required],
            comment: [this.attachmentL.comment],
        });       
        this.attachmentDialogForm.valueChanges.subscribe( event => {
            this.attachmentL.fileName = event.fileName;
            this.attachmentL.comment = event.comment;
        });       
    }
}
