import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';

import { BaseLinesChecker } from './lines-checker/base-lines-checker';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-lines-dialog',
  templateUrl: './lines-dialog.component.html',
  styleUrls: ['./lines-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LinesDialogComponent implements OnInit {
  
  dialogTitle: string;
  displayedColumns: string[];
  lines: any[];
  lineQty: number;
  selection = new SelectionModel<any>(true, []);
  lineErr = null;
  linesChecker: BaseLinesChecker;
  qtyControl: FormControl[]; 

  constructor(public dialogRef: MatDialogRef<LinesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private _data: any) {
    this.dialogTitle = _data.dialogTitle;
    this.displayedColumns = _data.displayedColumns;
    this.lineQty = _data.lineQty;
    this.linesChecker = _data.linesChcker;
    
    this.qtyControl = [];
  }

  ngOnInit(): void {
    this._data.lines.subscribe(data => {
      this.lines = data.items;
      this.lines.forEach(line => {
        this.qtyControl.push(new FormControl(''));
      });
    });
  }

  isAllSelected(): boolean {
    if (this.lines) {
      const numSelected = this.selection.selected.length;
      const numRows = this.lines.length;
      return numSelected === numRows;
    }
    return false;
  }

  masterToggle(): void {
    this.isAllSelected() ?
        this.selection.clear() :
        this.lines.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  checkQty(qty: number, element: any): void {
    this.lineErr = null;
    this.qtyControl.forEach(control => control.setErrors(null));
    
    const isValid = this.linesChecker.isQtyValid(
      element, this.lineQty, this.lines);
    
    if (!isValid) {
      this.qtyControl.forEach(control => control.setErrors({qty: true}));
      this.lineErr = this.lineQty ? 
        -1 : element.sol.lineSeq;
    } else {
      element.baseQty = qty;
    }
  }
}
