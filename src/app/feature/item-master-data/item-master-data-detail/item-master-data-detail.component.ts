import { Component, Input, OnInit, 
    Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

import { ItemMasterData } from '../ItemMasterData';
import { ItemGroupService } from 'app/feature/item-group/item-group.service';
import { Constants } from 'app/constants';
import { MatSelectChange } from '@angular/material';
import { UnitOfMeasure } from 'app/core/services/unit-of-measure/UnitOfMeasure';
import { UnitOfMeasureService } from 'app/core/services/unit-of-measure/unit-of-measure.service';

@Component({
    selector: 'app-item-master-data-detail',
    templateUrl: './item-master-data-detail.component.html',
    styleUrls: ['./item-master-data-detail.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class ItemMasterDataDetailComponent implements OnInit{
    
    @Input() 
    item: ItemMasterData;
    editedItem: ItemMasterData;
    unitOfMeasure: UnitOfMeasure[];
    form: FormGroup;
    groupCode: any[];
    itemType: any[];

    @Output() saveEvent = new EventEmitter<ItemMasterData>();
    
    constructor(
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private itemGroupService: ItemGroupService,
        private unitOfMeasureService: UnitOfMeasureService) {
        this.itemGroupService.loadListResults(
            0, '', '', '').subscribe(data => {
                this.groupCode = data.items;
            });
        this.unitOfMeasureService
            .getUnitOfMeasure().subscribe(data => {
                this.unitOfMeasure = data;
            });
        this.itemType = Constants.itemType.slice(0);
        if (this.router.getCurrentNavigation().extras.state) {
            this.editedItem = this.router.getCurrentNavigation().extras.state.item;
            this.route.queryParams.subscribe(params => {
                this.editedItem.itemGroupCode = +params['selectedGroup'];
        });
    }
    }

    ngOnInit(): void {
        if (this.editedItem) {
            this.item = this.editedItem;
        }
        this.form = this._formBuilder.group({
            itemId: [{
                value: this.item.itemID, disabled: true
            }, Validators.required],
            itemCode: [{
                value: this.item.itemCode, disabled: false
            }, Validators.required],
            itemName: [{
                value: this.item.itemName, disabled: false
            }, Validators.required],
            frgnName: [{
                value: this.item.frgnName, disabled: false
            }, Validators.required],
            itemGroupCode: [{
                value: this.item.itemGroupCode, disabled: false
            }, Validators.required],
            itemType: [{
                value: this.item.itemType, disabled: false
            }, Validators.required],
            baseUnitCode: [{
                value: this.item.baseUnitCode, disabled: true
            }, Validators.required],
            inventoryItem: [{
                value: this.item.inventoryItem, disabled: false
            }, Validators.required],
            sizeID: [{
                value: this.item.sizeID, disabled: true
            }, Validators.required],
            revisionManaged: [{
                value: this.item.revisionManaged, disabled: false
            }, Validators.required],
            revTypeID: [{
                value: this.item.revTypeID, disabled: false
            }]
        });
    }

    goBack(event: any): void {
        this.router.navigate(['/item-master-data']);
    }

    save(event: any): void{
        this.captureFromValues();
        this.saveEvent.next(this.item);
    }

    captureFromValues(): void {
        this.item.itemCode = this.form.get('itemCode').value;
        this.item.itemName = this.form.get('itemName').value;
        this.item.itemGroupCode = this.form.get('itemGroupCode').value;
        this.item.itemType = this.form.get('itemType').value;
        this.item.baseUnitCode = this.form.get('baseUnitCode').value;
        this.item.inventoryItem = this.form.get('inventoryItem').value;
    }

    groupSelect(event: MatSelectChange): void {
        if (event.value === -1) {
            this.captureFromValues();
            const navigationExtras: NavigationExtras = {
                queryParams: { showCheck: true, 
                    returnUrl: this.router.url },
                state: { item: this.item }
            };
            this.router.navigate(['./item-group'], 
                navigationExtras);
        }
    }
}
