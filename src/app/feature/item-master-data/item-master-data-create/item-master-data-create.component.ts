import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { BaseEditCreate } from 'app/feature/base-components/classes/base-edit-create';
import { ItemMasterDataService } from '../item-master-data.service';
import { ItemMasterData } from '../ItemMasterData';

@Component({
  selector: 'app-item-master-data-create',
  templateUrl: './item-master-data-create.component.html',
  styleUrls: ['./item-master-data-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItemMasterDataCreateComponent 
  extends BaseEditCreate<ItemMasterData, ItemMasterDataService>
  implements OnInit {
  

  constructor(public itemService: ItemMasterDataService,
              public router: Router,
              public route: ActivatedRoute,
              public snacBar: MatSnackBar,
              public translateService: TranslateService) { 
    super(itemService,
      router, route, snacBar, translateService,
      'IMD_CREATE',
      '/item-master-data');  
  }

  ngOnInit(): void {
    this.entity = new ItemMasterData();
  }

  save(event: ItemMasterData): void {
    const actionToTake = event.itemCode ? 'edit' : 'create';
    super.save(event,
      'IMD_CREATED', '\itemID', actionToTake,
      null, null );
  }
}
