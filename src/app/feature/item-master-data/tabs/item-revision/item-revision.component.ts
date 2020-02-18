import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ItemMasterData } from '../../ItemMasterData';
import { ReveisionTypeService } from 'app/feature/revision-type/reveision-type.service';
import { ReveisionType } from 'app/feature/revision-type/ReveisionType';
import { ItemRevisionService } from './item-revision.service';
import { ItemRevision } from './ItemRevision';

@Component({
  selector: 'app-item-revision',
  templateUrl: './item-revision.component.html',
  styleUrls: ['./item-revision.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItemRevisionComponent implements OnInit {

  @Input() 
  item: ItemMasterData;
  @Input()
  form: FormGroup;
  revTypes: ReveisionType[] = [];
  itemRevList: ItemRevision[] = [];
  columnsToDisplay: string[] = [];
  
  constructor(private revTypeService: ReveisionTypeService,
              private itemRevSerice: ItemRevisionService) { 
    this.columnsToDisplay = ['itemRevID', 'revisionCode', 'createDate', 
      'updateDate', 'delete'];
    }

  ngOnInit(): void {
    this.revTypeService.loadListResults(0, '', '', '')
      .subscribe(data => {
        if (data) {
          this.revTypes = data.items;
        }
      });
    if (this.item.revisionManaged) {
      if (this.item.revTypeID) {
        this.loadItemReveisions();
      }
    }
  }

  loadItemReveisions(): void {
    this.itemRevSerice.getItemRevisionByItemId(this.item.itemID)
      .subscribe(data => {
        if (data) {
          this.itemRevList = data.items;
          if (data.items.length > 0) {
            this.form.controls['revisionManaged'].disable();
            this.form.controls['revTypeID'].disable();
          }
        }
      });
  }

  revManageChange(): void {
    if (this.form.get('revisionManaged').value === true) {
      this.form.controls['revTypeID'].enable();
    } else {
      this.form.controls['revTypeID'].disable();
    }
  }

  revTypeSelect(): void {
    if (this.form.get('revTypeID').value) {
      this.loadItemReveisions();
    }
  }

  delete(element: ItemRevision): void {
    // this.
  }

}
