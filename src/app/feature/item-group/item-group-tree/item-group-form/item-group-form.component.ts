import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ItemGroup } from '../../ItemGroup';

@Component({
  selector: 'app-item-group-form',
  templateUrl: './item-group-form.component.html',
  styleUrls: ['./item-group-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ItemGroupFormComponent implements OnInit {

  @Input()
  itemGroup: ItemGroup;
  @Input()
  formArray: FormGroup[];
  form: FormGroup;

  @Output() 
  newChild = new EventEmitter<ItemGroup>();
  @Output()
  delete = new EventEmitter<ItemGroup>(); 
  
  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      itemGroupCode: [{
        value: this.itemGroup.itemGroupCode, 
        disabled: this.itemGroup.itemGroupCode ? true : false
      }, Validators.required],
      itemGroupName: [{
        value: this.itemGroup.itemGroupName, disabled: false
      }, Validators.required],
      parentGroupCode: [{
        value: this.itemGroup.parentGroupCode, disabled: false
      }]
    });
    this.formArray.push(this.form);
  }

  addNewlevel(): void {
    const newGroupChild = Object.assign(new ItemGroup(), {
      parentGroupCode: this.itemGroup.itemGroupCode
    });
    this.newChild.next(newGroupChild);
  }

  setGroupCode(): void {
    this.itemGroup.itemGroupCode = this.form.get('itemGroupCode').value;
  }

  setGroupName(): void {
    this.itemGroup.itemGroupName = this.form.get('itemGroupName').value;
  }

}
