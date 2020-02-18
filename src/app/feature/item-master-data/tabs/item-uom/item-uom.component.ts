import { Component, OnInit, Input, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ItemMasterData, ItemLogisticSite } from '../../ItemMasterData';
import { ItemUnitOfMeasure } from 'app/core/services/item-unit-of-measure/ItemUnitOfMeasure';
import { ItemUnitOfMeasureService } from 'app/core/services/item-unit-of-measure/item-unit-of-measure.service';

@Component({
  selector: 'app-item-uom',
  templateUrl: './item-uom.component.html',
  styleUrls: ['./item-uom.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItemUOMComponent implements OnInit, AfterViewInit {

  @Input()
  item: ItemMasterData;
  @Input()
  form: FormGroup;
  public itemLogisticSites: string[] = [];
  public itemUOMLogisticSiteDictionar: Map<string, ItemUnitOfMeasure[]> =
    new Map<string, ItemUnitOfMeasure[]>();
  public displayedColumns: string[] = [];


  constructor(private itemUnitOfMeasureService: ItemUnitOfMeasureService) { }

  ngOnInit(): void {
    this.itemLogisticSites = Object.keys(this.item['itemLogisticSites']);
  }

  ngAfterViewInit(): void {
    this.loadItemsUOFPerSite();
  }

  loadItemsUOFPerSite(): void {
    this.itemLogisticSites.forEach(element => {
      this.itemUnitOfMeasureService
        .getById(this.item.itemID, element)
          .subscribe((data) => {
            this.itemUOMLogisticSiteDictionar.set(element, data.items);
      });
    });
  }

}
